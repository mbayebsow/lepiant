import path from "path";
import axios from "axios";
import { load } from "cheerio";
import { addValue, getValue } from "../../lib/db.js";
import config from "../../lib/config.js";

let LOGS = [];
let STEP;
let TODAY;
let LASTPOSTDATE;
let QUOTIDIENS = [];

function dateShortConvert(dateISO) {
  const date = new Date(dateISO);

  // Extraction de l'année, du mois et du jour
  const annee = date.getFullYear();
  const mois = (date.getMonth() + 1).toString().padStart(2, "0"); // Les mois sont indexés de 0 à 11
  const jour = date.getDate().toString().padStart(2, "0");

  // Création de la chaîne de date au format court
  const dateCourte = `${annee}-${mois}-${jour}`;

  return dateCourte;
}

async function addQuotidien(quotidiens) {
  STEP = "🟠 Ajout des images quotidien a API";
  console.log(STEP);
  LOGS.push({ date: new Date(), message: STEP });

  const body = JSON.stringify(quotidiens);

  try {
    await axios.post(`${config.API_HOST}/quotidiens/many`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: config.API_TOKEN,
      },
    });

    STEP = "🟢 Quotidien ajouter avec success";
    console.log(STEP);
    LOGS.push({ date: new Date(), message: STEP });

    await addValue(`LAST_Q_DATE`, TODAY);
  } catch (error) {
    console.log(error);
    STEP = "🔴 Erreur lors de l'ajout du quotidien";
    console.log(STEP);
    LOGS.push({ date: new Date(), message: STEP });

    return null;
  }
}

async function uploadToImageKit(file) {
  const fileName = path.basename(file);
  if (fileName.includes("ODIA")) return null;

  const body = {
    file: file,
    fileName: fileName,
    folder: `/lepiant/quotidiens/${TODAY}/`,
  };

  const response = await axios.post(config.IMAGEKIT_ENDPOINT, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    auth: {
      username: config.IMAGEKIT_KEY,
      password: "",
    },
  });

  if (!response?.data?.fileId) {
    STEP = `🔴 Error uploading ${fileName} to IMAGEKIT`;
    console.log(STEP);
    LOGS.push({ date: new Date(), message: STEP });

    return null;
  }

  STEP = `🟢 ${fileName} success`;
  console.log(STEP);
  LOGS.push({ date: new Date(), message: STEP });

  const strucResponse = {
    images: response.data.url,
    thumbnailUrl: response.data.thumbnailUrl,
    publishedAt: LASTPOSTDATE,
  };
  return strucResponse;
}

async function getHtmlCode(url) {
  STEP = "🟠 Obstention du code HTML";
  console.log(STEP);
  LOGS.push({ date: new Date(), message: STEP });

  try {
    const response = await axios.get(url);
    const html = response.data;
    return html;
  } catch (error) {
    STEP = "🔴 Erreur lors de l'obstention du code HTML";
    console.log(STEP);
    LOGS.push({ date: new Date(), message: STEP });

    return null;
  }
}

async function extractImagesIntoHtml(htmlCode) {
  STEP = "🟠 Extraction des images du code HTML";
  console.log(STEP);
  LOGS.push({ date: new Date(), message: STEP });

  let URLs = [];
  let imageSelector = "figure > ul > li > figure > img";

  const $ = load(htmlCode);

  $(imageSelector).each((index, element) => {
    const imageUrl = $(element).attr("data-full-url");
    URLs.push(imageUrl);
  });

  return URLs;
}

async function getLastPost() {
  STEP = "🟠 Obstention du dernier publication";
  console.log(STEP);
  LOGS.push({ date: new Date(), message: STEP });

  let feedUrl =
    "https://parser-lepiant.deno.dev/?url=https://cafeactu.com/category/une-des-journaux,une-des-journaux-internationaux/feed/";
  let lastPost = null;

  try {
    const response = await axios.get(feedUrl);
    lastPost = response.data.entries[0];
  } catch (error) {
    STEP = "🔴 Erreur lors de l'obstention du dernier publication";
    console.log(STEP);
    LOGS.push({ date: new Date(), message: STEP });
    return null;
  }

  return lastPost;
}

async function job(articleLink) {
  const htmlCode = await getHtmlCode(articleLink);

  if (htmlCode) {
    const imagesExtracted = await extractImagesIntoHtml(htmlCode);

    if (imagesExtracted) {
      STEP = "🟠 Enregistrement des images dans imageKit";
      console.log(STEP);
      LOGS.push({ date: new Date(), message: STEP });

      const saveImageToImageKit = imagesExtracted.map(async (url, index) => {
        const quotidien = await uploadToImageKit(url);
        if (quotidien) {
          QUOTIDIENS.push(quotidien);
        }
      });

      await Promise.all(saveImageToImageKit);
      await addQuotidien(QUOTIDIENS);
      QUOTIDIENS = [];
    }
  }
}

export default async function quotidienFetcher() {
  TODAY = dateShortConvert(new Date());

  if (new Date().getDay() === 0) {
    return { date: new Date(), message: "Pas de publication le dimanche" };
  }

  const lastPost = await getLastPost();

  if (lastPost) {
    LASTPOSTDATE = dateShortConvert(lastPost.published);

    if (LASTPOSTDATE !== TODAY) {
      STEP =
        "🔵 Date du dernier post différente de la date d'aujourd'hui. Attente de 30 minutes...";
      console.log(STEP);
      LOGS.push({ date: new Date(), message: STEP });

      setTimeout(() => {
        quotidienFetcher();
      }, 1800000);
    } else {
      const dateDernierQuotidien = await getValue(`LAST_Q_DATE`);

      if (LASTPOSTDATE === dateDernierQuotidien) {
        STEP = "🔵 La date du dernier post est égale à la date du quotidien. Arrêt de la fonction.";
        console.log(STEP);
        LOGS.push({ date: new Date(), message: STEP });
        const CURRENT_LOGS = LOGS;
        LOGS = [];
        return CURRENT_LOGS;
      } else {
        await job(lastPost.link);
        const CURRENT_LOGS = LOGS;
        LOGS = [];
        return CURRENT_LOGS;
      }
    }
  }
}
