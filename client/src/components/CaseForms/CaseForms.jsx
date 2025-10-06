import { useState } from "react"
import { Box } from "@mui/material"
import NavTabs from "@/components/NavTabs/NavTabs"
import ObjectForm from "./ObjectForm"
import DefendantsForm from "./DefendantsForm"
import DebtForm from "./DebtForm"
import CourtForm from "./CourtForm"
import DocumentsForm from "./DocumentsForm"
import Comments from "./Comments"

export default function CaseForms({ form, onChange }) {
  const [tab, setTab] = useState("object")

  const tabs = [
    { value: "object", label: "Сведения" },
    { value: "debt", label: "Задолженность" },
    { value: "court", label: "Судебный приказ" },
    { value: "execution", label: "ИП" },
    { value: "documents", label: "Документы" },
  ]

  const handleTabChange = (newTab) => {
    setTab(newTab)
  }

  return (
    <Box sx={{ minHeight: "55vh" }}>
      <NavTabs
        mode="static"
        tabs={tabs}
        value={tab}
        onChange={handleTabChange}
      />
      <Box sx={{ mt: 2 }}>
        {tab === "object" && (
          <>
            <ObjectForm form={form} onChange={onChange} />
            <DefendantsForm form={form} onChange={onChange} />
            <Comments></Comments>
          </>
        )}
        {tab === "debt" && <DebtForm form={form} onChange={onChange} />}
        {tab === "court" && <CourtForm form={form} onChange={onChange} />}

        {tab === "documents" && (
          <DocumentsForm form={form} onChange={onChange} />
        )}
      </Box>
    </Box>
  )
}
