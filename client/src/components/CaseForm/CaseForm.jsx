import * as React from "react";
import { Grid, TextField, MenuItem, Divider } from "@mui/material";

const courtTypes = [
  { value: "мировой суд", label: "Мировой суд" },
  { value: "районный суд", label: "Районный суд" },
];

export default function CaseForm({ value, onChange }) {
  if (!value) return null;

  const setFieldByPath = (path, val) => {
    const copy = structuredClone(value);
    const segs = path.split(".");
    let ref = copy;
    for (let i = 0; i < segs.length - 1; i++) {
      const k = segs[i];
      if (k === "0") continue;
      ref[k] ??= {};
      ref = ref[k];
    }
    const last = segs[segs.length - 1];
    if (segs.includes("owners")) {
      const idx = Number(segs[segs.indexOf("owners") + 1]);
      ref = copy.owners[idx] ?? (copy.owners[idx] = {});
      ref[last] = val;
      onChange?.({ ...copy, owners: [...copy.owners] });
    } else {
      ref[last] = val;
      onChange?.(copy);
    }
  };
  const onChangePath = (p) => (e) => setFieldByPath(p, e?.target?.value);

  return (
    <Grid container spacing={2} sx={{ mt: 0 }}>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Лицевой счёт"
          value={value.account ?? ""}
          onChange={onChangePath("account")}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Площадь"
          type="number"
          value={value.area ?? ""}
          onChange={onChangePath("area")}
          fullWidth
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          label="Адрес объекта"
          value={value.objectAddress ?? ""}
          onChange={onChangePath("objectAddress")}
          fullWidth
        />
      </Grid>

      <Divider sx={{ width: "100%" }} />

      <Grid item xs={12}>
        <TextField
          label="Фамилия"
          value={value.owners?.[0]?.surname ?? ""}
          onChange={onChangePath("owners.0.surname")}
          fullWidth
        />
      </Grid>
      <Grid item xs={6} sm={4}>
        <TextField
          label="Имя"
          value={value.owners?.[0]?.name ?? ""}
          onChange={onChangePath("owners.0.name")}
          fullWidth
        />
      </Grid>
      <Grid item xs={6} sm={4}>
        <TextField
          label="Отчество"
          value={value.owners?.[0]?.patronymic ?? ""}
          onChange={onChangePath("owners.0.patronymic")}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          label="Дата рождения"
          value={value.owners?.[0]?.birthday ?? ""}
          onChange={onChangePath("owners.0.birthday")}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Паспорт"
          value={value.owners?.[0]?.passport ?? ""}
          onChange={onChangePath("owners.0.passport")}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          label="Доля"
          value={value.owners?.[0]?.share ?? ""}
          onChange={onChangePath("owners.0.share")}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Адрес владельца"
          value={value.owners?.[0]?.address ?? ""}
          onChange={onChangePath("owners.0.address")}
          fullWidth
        />
      </Grid>

      <Divider sx={{ width: "100%" }} />

      <Grid item xs={12} sm={4}>
        <TextField
          label="Дата подачи (дд.мм.гггг)"
          value={value.submission?.date ?? ""}
          onChange={onChangePath("submission.date")}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={8}>
        <TextField
          select
          label="Тип суда"
          value={value.submission?.court?.type ?? ""}
          onChange={onChangePath("submission.court.type")}
          sx={{ minWidth: 120 }}
        >
          {courtTypes.map((ct) => (
            <MenuItem key={ct.value} value={ct.value}>
              {ct.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Наименование суда"
          value={value.submission?.court?.name ?? ""}
          onChange={onChangePath("submission.court.name")}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Адрес суда"
          value={value.submission?.court?.address ?? ""}
          onChange={onChangePath("submission.court.address")}
          fullWidth
        />
      </Grid>

      <Divider sx={{ width: "100%" }} />
      <Grid item sx={{ my: 1, width: "100%" }}>
        <TextField
          label="Комментарии"
          value={value.comments ?? ""}
          onChange={onChangePath("comments")}
          fullWidth
          multiline
          rows={3}
          placeholder="Введите комментарии к делу..."
        />
      </Grid>
    </Grid>
  );
}
