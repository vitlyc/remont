import { useState } from "react";
import { Routes, Route } from "react-router";
import { Box, CssBaseline, Avatar } from "@mui/material";

import NavTabs from "./components/NavTabs/NavTabs";
import DropdownButton from "./components/DropdownButton";
import Cases from "./scenes/Cases";
import Statistics from "./scenes/Statistics";

function App() {
  return (
    <div className="app">
      <CssBaseline />
      <Box
        margin="0 auto"
        maxWidth="1400px"
        padding="1rem 2rem 4rem 2rem"
        display="flex"
        flexDirection="column"
      >
        <Box display="flex" alignItems="center">
          <NavTabs />
          <Box display="flex" alignItems="center">
            <DropdownButton />
          </Box>
        </Box>
        <Box>
          <Routes>
            <Route path="/" element={<Statistics />} />
            <Route path="/applications" element={<Cases />} />
            <Route path="/calendar" element={<div>Календарь</div>} />
            <Route path="*" element={<div>404</div>} />
          </Routes>
        </Box>
      </Box>
    </div>
  );
}

export default App;
