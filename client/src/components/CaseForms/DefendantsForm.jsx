import * as React from "react";
import { Box, TextField, Button, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback"; // Импортируем debounce

const makeEmptyDefendant = () => ({
  surname: "",
  name: "",
  patronymic: "",
  birthday: "",
  passport: "",
  address: "",
  share: "",
});
const ID_OPTIONS = [
  { key: "birthday", label: "Дата рождения" },
  { key: "passport", label: "Паспорт" },
  { key: "snils", label: "СНИЛС" },
];
export default function DefendantsForm({ form, onChange }) {
  const defendants = form.defendants || [];

  const updateDefendants = (mutator) => {
    const updatedForm = { ...form };
    updatedForm.defendants = mutator(updatedForm.defendants);
    onChange?.(updatedForm);
  };

  const addDefendant = () => {
    updateDefendants((defendants) => [...defendants, makeEmptyDefendant()]);
  };

  const removeDefendant = (index) => () => {
    updateDefendants((defendants) =>
      defendants.filter((_, idx) => idx !== index)
    );
  };

  const setDefendantField = (index, key) => (e) => {
    const value = e.target.value;
    updateDefendants((defendants) => {
      const updatedDefendants = [...defendants];
      updatedDefendants[index] = { ...updatedDefendants[index], [key]: value };
      return updatedDefendants;
    });
  };

  // Функция для преобразования даты в формат YYYY-MM-DD
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // Получаем строку в формате YYYY-MM-DD
  };

  // Создаем дебаунс для поля "Дата рождения"
  const setDebouncedBirthday = (index, key) => {
    return useDebouncedCallback((e) => {
      const value = e.target.value;
      updateDefendants((defendants) => {
        const updatedDefendants = [...defendants];
        updatedDefendants[index] = {
          ...updatedDefendants[index],
          [key]: value,
        };
        return updatedDefendants;
      });
    }, 500); // Задержка 500ms
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
      <Typography variant="h8" color="text.secondary">
        Ответчики
      </Typography>

      {defendants.map((defendant, index) => (
        <Box
          key={index}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          {/* ФИО и доля */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              size="small"
              label="Фамилия"
              value={defendant.surname}
              onChange={setDefendantField(index, "surname")}
              sx={{ flex: "1 1 220px" }}
            />
            <TextField
              size="small"
              label="Имя"
              value={defendant.name}
              onChange={setDefendantField(index, "name")}
              sx={{ flex: "1 1 160px" }}
            />
            <TextField
              size="small"
              label="Отчество"
              value={defendant.patronymic}
              onChange={setDefendantField(index, "patronymic")}
              sx={{ flex: "1 1 160px" }}
            />
            <TextField
              size="small"
              label="Доля"
              value={defendant.share}
              onChange={setDefendantField(index, "share")}
              sx={{ flex: "1 1 140px" }}
            />
            {index > 0 && (
              <IconButton
                aria-label="Удалить ответчика"
                onClick={removeDefendant(index)}
                size="small"
                sx={{ ml: "auto" }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          {/* Дата рождения с дебаунсом */}
          {defendant.birthday && (
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                size="small"
                label="Дата рождения"
                type="date"
                value={formatDate(defendant.birthday)} // Преобразуем дату в формат YYYY-MM-DD
                onChange={setDebouncedBirthday(index, "birthday")} // Используем дебаунс
                InputLabelProps={{ shrink: true }}
                sx={{ flex: "1 1 220px" }}
              />
            </Box>
          )}

          {/* Паспорт */}
          {defendant.passport && (
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                size="small"
                label="Паспорт"
                value={defendant.passport}
                onChange={setDefendantField(index, "passport")}
                sx={{ flex: "2 1 360px" }}
              />
            </Box>
          )}

          {/* Адрес */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              size="small"
              label="Адрес регистрации"
              value={defendant.address}
              onChange={setDefendantField(index, "address")}
              sx={{ flex: "1 1 100%" }}
            />
          </Box>
        </Box>
      ))}

      {/* Кнопка добавления нового ответчика */}
      <Button
        variant="contained"
        size="small"
        startIcon={<AddIcon />}
        onClick={addDefendant}
      >
        Добавить ответчика
      </Button>
    </Box>
  );
}
