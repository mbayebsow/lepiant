import { addJsonValue, getJsonValue } from "./db.js";
import config from "./config.js";

async function refreshToken() {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: config.AGENT,
      client_secret: config.CLIENT_SECRET,
      scope: "squidex-api",
    }),
  };

  const RESPONSE = await fetch("https://cdn.teldoo.site/identity-server/connect/token", options)
    .then((response) => response.json())
    .catch((err) => console.error(err));

  if (RESPONSE.access_token) {
    await addJsonValue(`${config.AGENT}:TOKEN`, RESPONSE, RESPONSE.expires_in);
    return RESPONSE.access_token;
  }
}

export async function getToken() {
  const TOKEN = await getJsonValue(`${config.AGENT}:TOKEN`);
  // Verification de l'existance du token
  if (!TOKEN?.access_token) {
    return await refreshToken();
  } else {
    return TOKEN.access_token;
  }
}
