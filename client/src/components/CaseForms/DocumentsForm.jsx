import * as React from "react"
import { Box, Typography, Link } from "@mui/material"
import FolderIcon from "@mui/icons-material/Folder"

export default function DocumentsForm({ form, onChange }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }} pl={1.6}>
      <FolderIcon />
      <Link
        href={form?.documents}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ textDecoration: "none", color: "inherit" }} // Убираем подчеркивание и устанавливаем цвет как у обычного текста
      >
        <Typography variant="body1">
          {form?.defendants[0].surname} {form?.defendants[0].name}{" "}
          {form?.defendants[0].patronymic}
        </Typography>
      </Link>
    </Box>
  )
}
