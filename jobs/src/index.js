import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";

import config from "./lib/config.js";
import articleJob from "./services/article/index.js";
import quotidienJob from "./services/quotidien/index.js";

const app = new Hono();

app.use(
  "/job/*",
  basicAuth({
    username: config.USERNAME,
    password: config.PASSWORD,
  })
);

app.get("/", async (c) => c.text(":("));

app.get("/job/quotidienJob", async (c) => {
  quotidienJob();
  return c.text("quotidienJob Started");
});

app.get("/job/articleJob", async (c) => {
  articleJob();
  return c.text("articleJob Started");
});

serve(
  {
    fetch: app.fetch,
    port: 8787,
  },
  (info) => {
    console.log(`Listening on http://localhost:${info.port}`);
  }
);
