import { useContext } from "react";
import { CasesContext } from "@/context/CasesContext.jsx";

export const useCases = () => {
  const ctx = useContext(CasesContext);
  if (!ctx) throw new Error("useCases must be used within <CasesProvider>");
  return ctx;
};
