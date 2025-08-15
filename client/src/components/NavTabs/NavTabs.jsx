import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Link, useLocation } from "react-router";

export default function NavTabs() {
  const { pathname } = useLocation();

  const value = pathname.startsWith("/applications") ? "/applications" : "/";

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs value={value} onChange={() => {}} aria-label="nav tabs">
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
