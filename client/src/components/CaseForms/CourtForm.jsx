// components/caseForms/CourtForm.jsx
import * as React from "react";
import { Box, Autocomplete, TextField, Typography } from "@mui/material";
import courtsData from "../../../data/kirov_city_magistrate_courts.json";

export default function CourtForm({ value, onChange }) {
  if (!value) return null;

  const court = value.submission?.court ?? {};
  const name = court.name ?? "";
  const address = court.address ?? "";

  const courts = Array.isArray(courtsData) ? courtsData : [];
  const courtNames = React.useMemo(() => courts.map((c) => c.name), [courts]);
  const courtByName = React.useMemo(() => {
    const m = new Map();
    courts.forEach((c) => m.set(c.name, c));
    return m;
  }, [courts]);
  const addresses = React.useMemo(() => courts.map((c) => c.address), [courts]);

  const updateCourt = React.useCallback(
    (patch) => {
      const copy = structuredClone(value);
      copy.submission ??= {};
      copy.submission.court ??= {};
      Object.assign(copy.submission.court, patch);
      onChange?.(copy);
    },
    [value, onChange]
  );

  const handleNameChange = (_evt, newValue) => {
    const v = newValue ?? "";
    if (!v) {
      updateCourt({ name: "", address: "" });
      return;
    }
    const match = courtByName.get(v);
    if (match) {
      updateCourt({ name: v, address: match.address });
    } else {
      updateCourt({ name: v });
    }
  };

  const handleAddressChange = (_evt, newValue) => {
    updateCourt({ address: newValue ?? "" });
  };

  // Один объект для всех дат
  const [courtDates, setCourtDates] = React.useState({
    dateSentToDebtor: "",
    dateSentToCourt: "",
    dateAcceptedForReview: "",
    dateDecisionMade: "",
  });

  const handleDateChange = (key) => (e) => {
    setCourtDates((prev) => ({ ...prev, [key]: e?.target?.value ?? "" }));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
      <Typography variant="h8" color="text.secondary">
        Судебный участок
      </Typography>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Autocomplete
          freeSolo
          options={courtNames}
          value={name}
          onChange={handleNameChange}
          onInputChange={handleNameChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Имя суда"
              placeholder="Выберите участок…"
              sx={{ minWidth: 320 }}
            />
          )}
          size="small"
          sx={{ flex: "1 1 360px" }}
        />

        <Autocomplete
          freeSolo
          options={addresses}
          value={address}
          onChange={handleAddressChange}
          onInputChange={handleAddressChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Адрес суда"
              placeholder="Укажите адрес (или выберите участок)"
              sx={{ minWidth: 320 }}
            />
          )}
          size="small"
          sx={{ flex: "1 1 360px" }}
        />
      </Box>

      {/* Даты с отображением по порядку */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
        {/* Направлено должнику */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            size="small"
            label="Направлено должнику"
            type="date"
            value={courtDates.dateSentToDebtor}
            onChange={handleDateChange("dateSentToDebtor")}
            InputLabelProps={{ shrink: true }}
            sx={{ flex: "0 1 220px" }}
          />
        </Box>

        {/* Направлено в суд */}
        {courtDates.dateSentToDebtor && (
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              size="small"
              label="Направлено в суд"
              type="date"
              value={courtDates.dateSentToCourt}
              onChange={handleDateChange("dateSentToCourt")}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: "0 1 220px" }}
            />
          </Box>
        )}

        {/* Принято к рассмотрению */}
        {courtDates.dateSentToCourt && (
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              size="small"
              label="Принято к рассмотрению"
              type="date"
              value={courtDates.dateAcceptedForReview}
              onChange={handleDateChange("dateAcceptedForReview")}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: "0 1 220px" }}
            />
          </Box>
        )}

        {/* Решение */}
        {courtDates.dateAcceptedForReview && (
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              size="small"
              label="Решение"
              type="date"
              value={courtDates.dateDecisionMade}
              onChange={handleDateChange("dateDecisionMade")}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: "0 1 220px" }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
