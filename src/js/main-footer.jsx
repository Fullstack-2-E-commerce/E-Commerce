import React from "react";
import ReactDOM from "react-dom/client";
import { Footer } from "../components/Footer.jsx";

const rootElement = document.getElementById("react-footer-root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Footer />
    </React.StrictMode>,
  );
}
