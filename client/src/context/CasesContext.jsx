import React, { createContext, useMemo, useState } from "react";
import initialCases from "../../data/cases.json";

export const CasesContext = createContext(null);

export function CasesProvider({ children }) {
  const [cases, setCases] = useState(initialCases);

  const value = useMemo(
    () => ({
      cases,
      setCases,
      getCaseById: (id) =>
        cases.find((c) => Number(c.id) === Number(id)) || null,

      addCase: (item) => setCases((prev) => [...prev, item]),

      updateCase: (id, patch) =>
        setCases((prev) =>
          prev.map((c) =>
            Number(c.id) === Number(id) ? { ...c, ...patch } : c
          )
        ),

      removeCase: (id) =>
        setCases((prev) => prev.filter((c) => Number(c.id) !== Number(id))),
    }),
    [cases]
  );

  return (
    <CasesContext.Provider value={value}>{children}</CasesContext.Provider>
  );
}
