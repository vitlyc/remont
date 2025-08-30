// components/caseForms/DefendantsForm.jsx
import * as React from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  IconButton,
  Typography,
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
  share: "",
  address: "",
  identifiers: [], // Идентификаторы по умолчанию пусты
});

export default function DefendantsForm({ value, onChange }) {
  if (!value) return null;

  const owners =
    Array.isArray(value.owners) && value.owners.length
      ? value.owners
      : [makeEmptyDefendant()];

  React.useEffect(() => {
    if (!Array.isArray(value.owners) || !value.owners.length) {
      const copy = structuredClone(value);
      copy.owners = [makeEmptyDefendant()];
      onChange?.(copy);
    }
  }, [value, onChange]);

  const updateOwners = (mutator) => {
    const copy = structuredClone(value);
    const list = [...copy.owners];
    mutator(list);
    copy.owners = list.length ? list : [makeEmptyDefendant()];
    onChange?.(copy);
  };

  const addDefendant = () =>
    updateOwners((list) => list.push(makeEmptyDefendant()));

  const removeDefendant = (idx) => () =>
    updateOwners((list) => {
      if (idx === 0 && list.length === 1) list[0] = makeEmptyDefendant();
      else list.splice(idx, 1);
    });

  const setField = (idx, key) => (e) => {
    const v = e?.target?.value ?? "";
    updateOwners((list) => {
      list[idx] = { ...(list[idx] ?? makeEmptyDefendant()), [key]: v };
    });
  };

  // ---------- локальные даты с дебаунсом ----------

  const [localDates, setLocalDates] = React.useState({});

  // синхронизация локального состояния при внешних изменениях owners
  React.useEffect(() => {
    const next = {};
    owners.forEach((person, i) => {
      (person?.identifiers ?? []).forEach((id, row) => {
        if (id?.type === "birthday") {
          next[`${i}:${row}`] = id.value ?? "";
        }
      });
    });
    setLocalDates(next);
  }, [owners]);

  const commitBirthday = useDebouncedCallback((i, row, val) => {
    updateOwners((list) => {
      const person = list[i] ?? makeEmptyDefendant();
      const arr = Array.isArray(person.identifiers)
        ? [...person.identifiers]
        : [];
      arr[row] = { ...(arr[row] ?? {}), type: "birthday", value: val };
      person.identifiers = arr;
      list[i] = person;
    });
  }, 200);

  const setIdType = (idx, row) => (e) => {
    const newType = e?.target?.value ?? "birthday";
    updateOwners((list) => {
      const person = list[idx] ?? makeEmptyDefendant();
      const arr = Array.isArray(person.identifiers)
        ? [...person.identifiers]
        : [];
      const cur = arr[row] ?? { type: "birthday", value: "" };

      let nextValue = cur.value ?? "";
      if (newType === "birthday" && !/^\d{4}-\d{2}-\d{2}$/.test(nextValue)) {
        nextValue = "";
      }
      arr[row] = { type: newType, value: nextValue };
      person.identifiers = arr;
      list[idx] = person;
    });

    if (newType === "birthday") {
      const key = `${idx}:${row}`;
      setLocalDates((s) => ({ ...s, [key]: "" }));
    }
  };

  const setIdValue = (idx, row) => (e) => {
    const v = e?.target?.value ?? "";
    const item = owners[idx]?.identifiers?.[row] ?? {
      type: "birthday",
      value: "",
    };

    if (item.type === "birthday") {
      const key = `${idx}:${row}`;
      setLocalDates((s) => ({ ...s, [key]: v }));
      commitBirthday(idx, row, v);
      return;
    }

    updateOwners((list) => {
      const person = list[idx] ?? makeEmptyDefendant();
      const arr = Array.isArray(person.identifiers)
        ? [...person.identifiers]
        : [];
      arr[row] = { ...(arr[row] ?? {}), type: item.type, value: v };
      person.identifiers = arr;
      list[idx] = person;
    });
  };

  const addIdRow = (idx) => () => {
    updateOwners((list) => {
      const person = list[idx] ?? makeEmptyDefendant();
      const arr = Array.isArray(person.identifiers)
        ? [...person.identifiers]
        : [];
      arr.push({ type: "birthday", value: "" });
      person.identifiers = arr;
      list[idx] = person;
    });
  };

  const removeIdRow = (idx, row) => () => {
    updateOwners((list) => {
      const person = list[idx] ?? makeEmptyDefendant();
      const arr = Array.isArray(person.identifiers)
        ? [...person.identifiers]
        : [];
      arr.splice(row, 1);
      person.identifiers = arr;
      list[idx] = person;
    });
    setLocalDates((s) => {
      const key = `${idx}:${row}`;
      const { [key]: _, ...rest } = s;
      const next = {};
      Object.entries(rest).forEach(([k, val]) => {
        const [iStr, rStr] = k.split(":");
        const i = Number(iStr);
        const r = Number(rStr);
        if (i === idx && r > row) next[`${i}:${r - 1}`] = val;
        else next[k] = val;
      });
      return next;
    });
  };

  const row = { display: "flex", gap: 1, flexWrap: "wrap" };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
      <Typography variant="h8" color="text.secondary">
        Ответчики
      </Typography>
      {owners.map((person, i) => {
        const identifiers = person.identifiers || [];

        return (
          <Box
            key={i}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {/* ФИО */}
            <Box sx={row}>
              <TextField
                size="small"
                label="Фамилия"
                value={person.surname ?? ""}
                onChange={setField(i, "surname")}
                sx={{ flex: "1 1 220px" }}
              />
              <TextField
                size="small"
                label="Имя"
                value={person.name ?? ""}
                onChange={setField(i, "name")}
                sx={{ flex: "1 1 160px" }}
              />
              <TextField
                size="small"
                label="Отчество"
                value={person.patronymic ?? ""}
                onChange={setField(i, "patronymic")}
                sx={{ flex: "1 1 160px" }}
              />
              {i > 0 && (
                <IconButton
                  aria-label="Удалить ответчика"
                  onClick={removeDefendant(i)}
                  size="small"
                  sx={{ ml: "auto" }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              )}
            </Box>

            {/* Доля + Адрес */}
            <Box sx={{ display: "flex", gap: 2, mt: 0 }}>
              <TextField
                size="small"
                label="Доля"
                value={person.share ?? ""}
                onChange={setField(i, "share")}
                sx={{
                  display: "inline-flex",
                  maxWidth: "150px",
                }}
              />
              <TextField
                size="small"
                label="Адрес владельца"
                value={person.address ?? ""}
                onChange={setField(i, "address")}
                fullWidth
              />
            </Box>

            {/* Идентификаторы */}
            {identifiers.map((it, rowIdx) => {
              const label = ID_OPTIONS.find((o) => o.key === it.type)?.label;
              const isBirthday = it.type === "birthday";

              return (
                <Box
                  key={rowIdx}
                  sx={{ display: "flex", gap: 1, alignItems: "center" }}
                >
                  <TextField
                    size="small"
                    select
                    label="Тип"
                    value={it.type ?? "birthday"}
                    onChange={setIdType(i, rowIdx)}
                    sx={{ flex: "0 1 180px" }}
                  >
                    {ID_OPTIONS.map((o) => (
                      <MenuItem key={o.key} value={o.key}>
                        {o.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  {isBirthday ? (
                    <TextField
                      size="small"
                      label="Дата рождения"
                      type="date"
                      value={localDates[`${i}:${rowIdx}`] || it.value || ""}
                      onChange={setIdValue(i, rowIdx)}
                      InputLabelProps={{ shrink: true }}
                      sx={{ flex: "0 1 200px" }}
                    />
                  ) : (
                    <TextField
                      size="small"
                      label={label}
                      value={it.value || ""}
                      onChange={setIdValue(i, rowIdx)}
                      sx={{ flex: "2 1 300px" }}
                    />
                  )}

                  <IconButton
                    aria-label="Удалить идентификатор"
                    onClick={removeIdRow(i, rowIdx)}
                    size="small"
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              );
            })}

            <Box>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={addIdRow(i)}
              >
                Добавить идентификатор
              </Button>
            </Box>
          </Box>
        );
      })}

      <Box>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={addDefendant}
        >
          Добавить ответчика
        </Button>
      </Box>
    </Box>
  );
}
