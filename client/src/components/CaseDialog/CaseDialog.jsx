import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const courtTypes = [
  { value: "мировой суд", label: "Мировой суд" },
  { value: "районный суд", label: "Районный суд" },
];

export default function CaseDialog({ open, onClose, data, onSave, onDelete }) {
  const [form, setForm] = React.useState(data);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  React.useEffect(() => {
    setForm(data);
  }, [data]);

  if (!form) return null;

  const onChange = (path) => (e) => {
    const value = e?.target?.value;
    setForm((prev) => {
      const copy = structuredClone(prev);
      const segments = path.split(".");
      let ref = copy;
      for (let i = 0; i < segments.length - 1; i++) {
        const key = segments[i];
        if (key === "0") continue;
        ref[key] ??= {};
        ref = ref[key];
      }
      const last = segments[segments.length - 1];
      if (segments.includes("owners")) {
        const idx = Number(segments[segments.indexOf("owners") + 1]);
        ref = copy.owners[idx] ?? (copy.owners[idx] = {});
        ref[last] = value;
        return { ...copy, owners: [...copy.owners] };
      }
      ref[last] = value;
      return copy;
    });
  };

  const handleSave = () => onSave?.(form);
  const handleAskDelete = () => setConfirmOpen(true);
  const handleCancelDelete = () => setConfirmOpen(false);
  const handleConfirmDelete = () => {
    setConfirmOpen(false);
    onDelete?.(form.id);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {form.__isNew ? "Новое дело" : `Редактирование дела #${form.id}`}
        </DialogTitle>
        <Divider sx={{ width: "100%" }} />
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            {/* Основное */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Лицевой счёт"
                value={form.account ?? ""}
                onChange={onChange("account")}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Площадь"
                type="number"
                value={form.area ?? ""}
                onChange={onChange("area")}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Адрес объекта"
                value={form.objectAddress ?? ""}
                onChange={onChange("objectAddress")}
                fullWidth
              />
            </Grid>

            <Divider sx={{ width: "100%" }} />

            {/* Владелец (первый) */}
            <Grid item xs={12}>
              <TextField
                label="Фамилия"
                value={form.owners?.[0]?.surname ?? ""}
                onChange={onChange("owners.0.surname")}
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                label="Имя"
                value={form.owners?.[0]?.name ?? ""}
                onChange={onChange("owners.0.name")}
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                label="Отчество"
                value={form.owners?.[0]?.patronymic ?? ""}
                onChange={onChange("owners.0.patronymic")}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Дата рождения"
                value={form.owners?.[0]?.birthday ?? ""}
                onChange={onChange("owners.0.birthday")}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Паспорт"
                value={form.owners?.[0]?.passport ?? ""}
                onChange={onChange("owners.0.passport")}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Доля"
                value={form.owners?.[0]?.share ?? ""}
                onChange={onChange("owners.0.share")}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Адрес владельца"
                value={form.owners?.[0]?.address ?? ""}
                onChange={onChange("owners.0.address")}
                fullWidth
              />
            </Grid>

            <Divider sx={{ width: "100%" }} />

            {/* Подача и суд */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Дата подачи (дд.мм.гггг)"
                value={form.submission?.date ?? ""}
                onChange={onChange("submission.date")}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                select
                label="Тип суда"
                value={form.submission?.court?.type ?? ""}
                onChange={onChange("submission.court.type")}
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
                value={form.submission?.court?.name ?? ""}
                onChange={onChange("submission.court.name")}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Адрес суда"
                value={form.submission?.court?.address ?? ""}
                onChange={onChange("submission.court.address")}
                fullWidth
              />
            </Grid>

            {/* Комментарии */}
            <Divider sx={{ width: "100%" }} />
            <Grid item sx={{ my: 1, width: "100%" }}>
              <TextField
                label="Комментарии"
                value={form.comments ?? ""}
                onChange={onChange("comments")}
                fullWidth
                multiline
                rows={3}
                placeholder="Введите комментарии к делу..."
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ gap: 1 }}>
          {/* Кнопка удаления - иконка корзины */}
          {!form.__isNew && (
            <Tooltip title="Удалить дело" arrow>
              <IconButton
                color="error"
                onClick={handleAskDelete}
                sx={{ mr: "auto" }} // уводим корзину влево, а кнопки сохранить/отмена — вправо
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Tooltip>
          )}

          <Button onClick={onClose} variant="outlined">
            Отмена
          </Button>
          <Button onClick={handleSave} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog open={confirmOpen} onClose={handleCancelDelete}>
        <DialogTitle>Удалить дело?</DialogTitle>
        <DialogContent dividers>
          Подтвердите удаление дела {form?.id ? `#${form.id}` : ""}.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} variant="outlined">
            Нет
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Да, удалить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
