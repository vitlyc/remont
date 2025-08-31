import * as React from "react";
import { Box, TextField, Typography } from "@mui/material";

export default function ObjectForm({ form, onChange }) {
  const onField = (key) => (e) => {
    const v = e.target.value;

    onChange?.({ ...form, object: { ...form.object, [key]: v } });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
      <Typography variant="h8" color="text.secondary">
        Объект
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mt: 0 }}>
        <TextField
          label="Лицевой счёт"
          value={form.object?.account}
          onChange={onField("account")}
          fullWidth
          size="small"
          sx={{ maxWidth: "150px" }}
        />
        <TextField
          label="Площадь"
          type="number"
          value={form.object?.area}
          onChange={onField("area")}
          fullWidth
          size="small"
          sx={{ maxWidth: "150px" }}
        />
        <TextField
          label="Адрес объекта"
          value={form.object?.objectAddress}
          onChange={onField("objectAddress")}
          fullWidth
          size="small"
        />
      </Box>
    </Box>
  );
}
