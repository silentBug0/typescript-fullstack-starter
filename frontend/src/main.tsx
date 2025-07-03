import React from "react";
import ReactDom from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
