// components/CaseForms/ObjectForm.jsx
import * as React from "react";
import { Box, TextField, Typography } from "@mui/material";

export default function ObjectForm({ value, onChange }) {
  if (!value) return null;

  const onField = (key) => (e) => {
    const v = e?.target?.value ?? "";
    onChange?.({ ...value, [key]: v });
  };
  console.log(value);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
      <Typography variant="h8" color="text.secondary">
        Объект
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mt: 0 }}>
        <TextField
          label="Лицевой счёт"
          value={value.account ?? ""}
          onChange={onField("account")}
          fullWidth
          size="small"
          sx={{
            display: "inline-flex",
            maxWidth: "150px",
          }}
        />

        <TextField
          label="Площадь"
          type="number"
          value={value.area ?? ""}
          onChange={onField("area")}
          fullWidth
          size="small"
          sx={{
            display: "inline-flex",
            maxWidth: "150px",
          }}
        />

        <TextField
          label="Адрес объекта"
          value={value.objectAddress ?? ""}
          onChange={onField("objectAddress")}
          fullWidth
          size="small"
        />
      </Box>
    </Box>
  );
}
