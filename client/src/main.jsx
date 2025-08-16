import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { store } from "./store";
import { CasesProvider } from "@/context/CasesContext.jsx";
import "@/index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <CasesProvider>
          <App />
        </CasesProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
