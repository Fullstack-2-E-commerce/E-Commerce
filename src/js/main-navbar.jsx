import React from "react";
import ReactDOM from "react-dom/client";
import { Navbar } from "../components/Navbar.jsx";

const rootElement = document.getElementById("react-navbar-root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Navbar />
    </React.StrictMode>,
  );
}
