// components/caseForms/CaseForms.jsx
import * as React from "react";
import { Box, Divider } from "@mui/material";
import NavTabs from "@/components/NavTabs/NavTabs";

import ObjectForm from "./ObjectForm";
// ⬇️ новый общий редактор нескольких ответчиков
import DefendantsForm from "./DefendantsForm";
import DebtForm from "./DebtForm";
import CourtForm from "./CourtForm";

export default function CaseForms({ value, onChange }) {
  const [tab, setTab] = React.useState("object");

  const tabs = [
    { value: "object", label: "Сведения" },
    { value: "debt", label: "Задолженность" },
    { value: "court", label: "Судебный приказ" },
  ];

  return (
    <Box
      sx={{
        minHeight: "45vh",
      }}
    >
      <NavTabs mode="static" tabs={tabs} value={tab} onChange={setTab} />

      <Box sx={{ mt: 2 }}>
        {tab === "object" && (
          <>
            <ObjectForm value={value} onChange={onChange} />
            <DefendantsForm value={value} onChange={onChange} />{" "}
          </>
        )}
        {tab === "debt" && (
          <>
            <DebtForm value={value} onChange={onChange} />{" "}
          </>
        )}
        {tab === "court" && (
          <>
            <CourtForm value={value} onChange={onChange} />
          </>
        )}
      </Box>
    </Box>
  );
}
