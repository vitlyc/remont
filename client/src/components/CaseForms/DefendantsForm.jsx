// components/caseForms/DefendantsForm.jsx
import * as React from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  MenuItem,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

const ID_OPTIONS = [
  { key: "birthday", label: "Дата рождения" },
  { key: "passport", label: "Паспорт" },
  { key: "snils", label: "СНИЛС" },
];

const makeEmptyDefendant = () => ({
  surname: "",
  name: "",
  patronymic: "",
  birthday: "",
  passport: "",
  snils: "",
  address: "",
  share: "",
});

export default function DefendantsForm({ form, onChange }) {
  const defendants = form.defendants || [];

  // какие идентификаторы показываем у каждого ответчика
  const [visibleIds, setVisibleIds] = React.useState({});
  // локальные значения дат для плавного ввода (не дёргаем form каждый тик)
  const [localBirthdays, setLocalBirthdays] = React.useState({});

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  };

  const updateDefendants = React.useCallback(
    (mutator) => {
      const updatedForm = { ...form };
      updatedForm.defendants = mutator([...(form.defendants || [])]);
      onChange?.(updatedForm);
    },
    [form, onChange]
  );

  const setDefendantField = React.useCallback(
    (index, key) => (e) => {
      const value = e?.target?.value ?? "";
      updateDefendants((list) => {
        list[index] = { ...list[index], [key]: value };
        return list;
      });
    },
    [updateDefendants]
  );

  // инициализация пресетов идентификаторов и локальных дат при изменении количества ответчиков
  React.useEffect(() => {
    const nextVisible = {};
    const nextBirthdays = {};
    defendants.forEach((d, i) => {
      const preset = ID_OPTIONS.map((o) => o.key).filter((k) =>
        Boolean(d?.[k])
      );
      nextVisible[i] = visibleIds[i]?.length
        ? Array.from(new Set([...preset, ...visibleIds[i]]))
        : preset;
      nextBirthdays[i] = formatDate(d?.birthday);
    });
    setVisibleIds(nextVisible);
    setLocalBirthdays((prev) => ({ ...prev, ...nextBirthdays }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defendants.length]);

  // debounced-коммит даты рождения в form
  const commitBirthday = useDebouncedCallback((index, value) => {
    updateDefendants((list) => {
      list[index] = { ...list[index], birthday: value };
      return list;
    });
  }, 350);

  const addDefendant = () => {
    updateDefendants((list) => [...list, makeEmptyDefendant()]);
  };

  const removeDefendant = (index) => () => {
    updateDefendants((list) => list.filter((_, idx) => idx !== index));
    // синхронно чистим локальные структуры
    setVisibleIds((s) => {
      const copy = { ...s };
      delete copy[index];
      const shifted = {};
      Object.keys(copy)
        .map(Number)
        .sort((a, b) => a - b)
        .forEach((oldKey) => {
          shifted[oldKey > index ? oldKey - 1 : oldKey] = copy[oldKey];
        });
      return shifted;
    });
    setLocalBirthdays((s) => {
      const copy = { ...s };
      delete copy[index];
      const shifted = {};
      Object.keys(copy)
        .map(Number)
        .sort((a, b) => a - b)
        .forEach((oldKey) => {
          shifted[oldKey > index ? oldKey - 1 : oldKey] = copy[oldKey];
        });
      return shifted;
    });
  };

  const addIdRow = (index, key) => {
    setVisibleIds((s) => {
      const arr = s[index] ? [...s[index]] : [];
      if (!arr.includes(key)) arr.push(key);
      return { ...s, [index]: arr };
    });
    if (key === "birthday") {
      setLocalBirthdays((s) => ({ ...s, [index]: s[index] ?? "" }));
    }
  };

  const removeIdRow = (index, key) => () => {
    setVisibleIds((s) => {
      const arr = (s[index] || []).filter((k) => k !== key);
      return { ...s, [index]: arr };
    });
    updateDefendants((list) => {
      list[index] = { ...list[index], [key]: "" };
      return list;
    });
    if (key === "birthday") {
      setLocalBirthdays((s) => ({ ...s, [index]: "" }));
    }
  };

  // опции, которых ещё нет у конкретного ответчика
  const availableOptions = (index) => {
    const shown = new Set(visibleIds[index] || []);
    return ID_OPTIONS.filter((o) => !shown.has(o.key));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
      <Typography variant="h8" color="text.secondary">
        Ответчики
      </Typography>

      {defendants.map((defendant, index) => {
        const shownIds = visibleIds[index] || [];

        return (
          <Box
            key={index}
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
          >
            {/* ФИО / доля / адрес / удалить */}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <TextField
                size="small"
                label="Фамилия"
                value={defendant.surname}
                onChange={setDefendantField(index, "surname")}
                sx={{ width: "auto" }}
              />
              <TextField
                size="small"
                label="Имя"
                value={defendant.name}
                onChange={setDefendantField(index, "name")}
                sx={{ width: "auto" }}
              />
              <TextField
                size="small"
                label="Отчество"
                value={defendant.patronymic}
                onChange={setDefendantField(index, "patronymic")}
                sx={{ width: "auto" }}
              />
              <TextField
                size="small"
                label="Доля"
                value={defendant.share}
                onChange={setDefendantField(index, "share")}
                sx={{ width: 80 }}
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
              <TextField
                size="small"
                label="Адрес регистрации"
                value={defendant.address}
                onChange={setDefendantField(index, "address")}
                sx={{ flex: "1 1 auto" }}
              />
            </Box>

            {/* Заголовок блока идентификаторов */}
            <Typography variant="h8" color="text.secondary" sx={{ m: 1 }}>
              Идентификаторы
            </Typography>

            {/* Идентификаторы — стопкой (column) */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {shownIds.map((key) => {
                const opt = ID_OPTIONS.find((o) => o.key === key);
                if (!opt) return null;

                const isBirthday = key === "birthday";
                const value = isBirthday
                  ? localBirthdays[index] ?? formatDate(defendant.birthday)
                  : defendant[key] || "";

                const onChange = isBirthday
                  ? (e) => {
                      const v = e?.target?.value ?? "";
                      setLocalBirthdays((s) => ({ ...s, [index]: v }));
                      commitBirthday(index, v); // дебаунс-commit в form
                    }
                  : setDefendantField(index, key);

                return (
                  <Box
                    key={key}
                    sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                  >
                    <TextField
                      size="small"
                      label={opt.label}
                      type={isBirthday ? "date" : "text"}
                      value={value}
                      onChange={onChange}
                      InputLabelProps={
                        isBirthday ? { shrink: true } : undefined
                      }
                      sx={{ width: 240 }}
                    />
                    <IconButton
                      aria-label={`Удалить ${opt.label}`}
                      onClick={removeIdRow(index, key)}
                      size="small"
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                );
              })}
            </Box>

            {/* Добавить идентификатор */}
            {availableOptions(index).length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <TextField
                  size="small"
                  select
                  label="Добавить идентификатор"
                  value=""
                  onChange={(e) => {
                    const k = e.target.value;
                    if (!k) return;
                    addIdRow(index, k);
                  }}
                  sx={{ width: 240 }}
                >
                  {availableOptions(index).map((o) => (
                    <MenuItem key={o.key} value={o.key}>
                      {o.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            )}
          </Box>
        );
      })}

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
