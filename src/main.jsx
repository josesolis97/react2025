import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Manejar redirección desde 404.html
if (sessionStorage.redirect) {
  const redirect = sessionStorage.redirect;
  delete sessionStorage.redirect;
  window.history.replaceState(null, null, redirect);
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
