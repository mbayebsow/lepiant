import { setDataOnStore, getDataOnStore } from "../lib/index.js";

async function refreshToken() {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: "lepiant:lepiant-app-mobile",
      client_secret: "qbitqqckjrprivlg2urwbfgxuvozbt4ftjrfwaxucvux",
      scope: "squidex-api",
    }).toString(),
  };

  const RESPONSE = await fetch("https://cdn.teldoo.site/identity-server/connect/token", options)
    .then((response) => response.json())
    .catch((err) => console.error(err));

  if (RESPONSE.access_token) {
    await setDataOnStore("TOKEN", RESPONSE.access_token)
    // await addJsonValue(`${config.AGENT}:TOKEN`, RESPONSE, RESPONSE.expires_in);
    return RESPONSE.access_token;
  }
}

export async function getToken(): Promise<String> {
    const TOKEN = await getDataOnStore("TOKEN")
    
    if (TOKEN) {
        return TOKEN;
    } else {
        return await refreshToken();
    }
}