import React from "react";
import App from "./App.tsx";
import "./index.css";
import { createRoot } from "react-dom/client";

const rootEl = document.querySelector<HTMLElement>("#root");

if (rootEl) {
  const root = createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
