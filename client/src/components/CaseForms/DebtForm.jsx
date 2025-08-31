// components/caseForms/DebtForm.jsx
import * as React from "react";
import { Box, TextField, Typography } from "@mui/material";
import { calcStateDuty } from "@/utils/calcStateDuty";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

function DebtFormInner({ form, onChange }) {
  if (!form) return null;

  const debt = form.debt ?? {};
  const period = debt.period ?? {};

  const [localFrom, setLocalFrom] = React.useState(period.from ?? "");
  const [localTo, setLocalTo] = React.useState(period.to ?? "");

  React.useEffect(() => {
    setLocalFrom(period.from ?? "");
    setLocalTo(period.to ?? "");
  }, [period.from, period.to]);

  const commitPeriod = useDebouncedCallback((key, val) => {
    const next = {
      ...form,
      debt: {
        ...form.debt,
        period: { ...(form.debt?.period ?? {}), [key]: val },
      },
    };
    onChange?.(next);
  }, 300);

  const setDebtNumber = (key) => (e) => {
    const raw = e?.target?.value ?? "";
    const next = { ...form, debt: { ...(form.debt ?? {}) } };

    next.debt[key] = toNumberOrEmpty(raw);

    const principal = toNumberOrEmpty(next.debt.principal);
    const penalty = toNumberOrEmpty(next.debt.penalty);
    const total =
      principal === "" && penalty === ""
        ? ""
        : Number(principal || 0) + Number(penalty || 0);

    next.debt.total = total;
    next.debt.duty = total === "" ? "" : calcStateDuty(total);

    onChange?.(next);
  };

  const toNumberOrEmpty = (raw) => {
    if (raw === "" || raw == null) return "";
    const n = Number(String(raw).replace(",", "."));
    return Number.isFinite(n) ? n : "";
  };

  const fieldSx = { flex: "1 1 240px" };

  const displayTotal =
    debt.principal === "" && debt.penalty === ""
      ? ""
      : Number(debt.principal || 0) + Number(debt.penalty || 0);

  const displayDuty = displayTotal === "" ? "" : calcStateDuty(displayTotal);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
      <Typography variant="h8" color="text.secondary">
        Задолженность
      </Typography>

      <Box
        sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}
      >
        <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
          Период задолженности с
        </Typography>
        <TextField
          size="small"
          label="Начало"
          type="date"
          value={localFrom}
          onChange={(e) => {
            const v = e?.target?.value ?? "";
            setLocalFrom(v);
            React.startTransition(() => commitPeriod("from", v));
          }}
          InputLabelProps={{ shrink: true }}
          sx={{ flex: "0 1 220px" }}
        />
        <Typography variant="body2">по</Typography>
        <TextField
          size="small"
          label="Конец"
          type="date"
          value={localTo}
          onChange={(e) => {
            const v = e?.target?.value ?? "";
            setLocalTo(v);
            React.startTransition(() => commitPeriod("to", v));
          }}
          InputLabelProps={{ shrink: true }}
          sx={{ flex: "0 1 220px" }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "flex-start",
        }}
      >
        <TextField
          size="small"
          label="Основной долг"
          type="number"
          value={debt.principal ?? ""}
          onChange={setDebtNumber("principal")}
          sx={{
            width: "auto",
          }}
        />
        <TextField
          size="small"
          label="Пени"
          type="number"
          value={debt.penalty ?? ""}
          onChange={setDebtNumber("penalty")}
          sx={{
            display: "inline-flex",
            maxWidth: "150px",
          }}
        />
        <TextField
          size="small"
          label="Цена иска (авто)"
          type="number"
          value={displayTotal}
          InputProps={{ readOnly: true }}
          helperText=""
          sx={{
            width: "auto",
          }}
        />
        <TextField
          size="small"
          label="Госпошлина (авто)"
          type="number"
          value={displayDuty}
          InputProps={{ readOnly: true }}
          helperText=""
          sx={{
            display: "inline-flex",
            maxWidth: "170px",
          }}
        />
      </Box>
    </Box>
  );
}

export default React.memo(DebtFormInner);
