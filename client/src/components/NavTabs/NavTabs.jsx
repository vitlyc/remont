// components/NavTabs/NavTabs.jsx
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Link, useLocation } from "react-router";

/**
 * mode = 'router' | 'static'
 *  - 'router' (по умолчанию): ведёт себя как раньше, Tab -> Link, меняет pathname
 *  - 'static': не меняет URL, управляется через props value/onChange и массив tabs
 *
 * В режиме 'router' старый интерфейс сохранён.
 * В режиме 'static' ожидает props:
 *   - tabs: [{ value: string, label: string }]
 *   - value: string
 *   - onChange: (newValue) => void
 */
export default function NavTabs({
  mode = "router",
  tabs,
  value: controlledValue,
  onChange,
  ...rest
}) {
  if (mode === "static") {
    return (
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={controlledValue}
          onChange={(_, v) => onChange?.(v)}
          aria-label="static nav tabs"
          {...rest}
        >
          {(tabs ?? []).map((t) => (
            <Tab key={t.value} value={t.value} label={t.label} disableRipple />
          ))}
        </Tabs>
      </Box>
    );
  }

  // режим router — поведение как раньше
  const { pathname } = useLocation();
  const value = pathname.startsWith("/applications") ? "/applications" : "/";

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs value={value} onChange={() => {}} aria-label="nav tabs" {...rest}>
        <Tab
          value="/"
          label="Статистика"
          component={Link}
          to="/"
          disableRipple
        />
        <Tab
          value="/applications"
          label="Заявления"
          component={Link}
          to="/applications"
          disableRipple
        />
        <Tab
          value="/calendar"
          label="Календарь"
          component={Link}
          to="/calendar"
          disableRipple
          disabled
        />
      </Tabs>
    </Box>
  );
}
