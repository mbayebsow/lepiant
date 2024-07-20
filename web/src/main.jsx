import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import moment from "moment/moment";
import "moment/locale/fr";

moment.locale("fr");

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
