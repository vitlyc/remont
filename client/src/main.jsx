import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "@/index.css";
import App from "./App.jsx";
import { CasesProvider } from "@/context/CasesContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <CasesProvider>
        <App />
      </CasesProvider>
    </BrowserRouter>
  </StrictMode>
);
