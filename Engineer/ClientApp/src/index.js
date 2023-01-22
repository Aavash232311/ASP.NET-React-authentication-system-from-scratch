import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { Utility } from "./Utility/utils";
import {BrowserRouter} from "react-router-dom";

const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href");
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

const parentFunction = () => {
  const utls = new Utility();
  try {
    fetch("https://localhost:44461/item/Init", {
      headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": utls.CSRF("XSRF-TOKEN")
        },
        credentials: "include"
    });
  } catch (ex) {
    console.log(ex);
  }
};

parentFunction();
root.render(
  <BrowserRouter basename={baseUrl}>
    <App />
  </BrowserRouter>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
