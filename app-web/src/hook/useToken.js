import { createStore, createHook } from "react-sweet-state";

async function getToken() {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: "lepiant:lepiant-app-mobile",
      client_secret: "qbitqqckjrprivlg2urwbfgxuvozbt4ftjrfwaxucvux",
      scope: "squidex-api",
    }),
  };

  const token = fetch("https://cdn.teldoo.site/identity-server/connect/token", options)
    .then((response) => response.json())
    .then((response) => response)
    .catch((err) => console.error(err));

  return token;
}

const Store = createStore({
  initialState: { token: null },
  actions: {
    setToken:
      () =>
      async ({ setState }) => {
        const token = await getToken();
        setState({
          token,
        });
      },
  },
});

export default function useToken() {
  const tokenStore = createHook(Store);
  const [{ token }, { setToken }] = tokenStore();

  return {
    token,
    setToken,
  };
}
