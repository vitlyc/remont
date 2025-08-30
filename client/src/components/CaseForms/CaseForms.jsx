import * as React from "react";
import { Box } from "@mui/material";
import NavTabs from "@/components/NavTabs/NavTabs";
import ObjectForm from "./ObjectForm";
import DefendantsForm from "./DefendantsForm";
import DebtForm from "./DebtForm";
import CourtForm from "./CourtForm";

export default function CaseForms({ form, onChange }) {
  const [tab, setTab] = React.useState("object");

  const tabs = [
    { value: "object", label: "Сведения" },
    { value: "debt", label: "Задолженность" },
    { value: "court", label: "Судебный приказ" },
  ];

  return (
    <Box sx={{ minHeight: "45vh" }}>
      <NavTabs mode="static" tabs={tabs} value={tab} onChange={setTab} />
      <Box sx={{ mt: 2 }}>
        {tab === "object" && (
          <>
            <ObjectForm form={form} onChange={onChange} />
            <DefendantsForm form={form} onChange={onChange} />
          </>
        )}
        {tab === "debt" && <DebtForm form={form} onChange={onChange} />}
        {tab === "court" && <CourtForm form={form} onChange={onChange} />}
      </Box>
    </Box>
  );
}
