import { useState, useCallback } from "react"
import { Routes, Route } from "react-router"
import { Box, CssBaseline } from "@mui/material"
import NavTabs from "./components/NavTabs/NavTabs"
import DropdownButton from "./components/DropdownButton"
import Cases from "./scenes/Cases"
import Statistics from "./scenes/Statistics"
import AppModal from "@/components/Modal/AppModal"
import LoginForm from "@/components/Auth/LoginForm"
import {
  useLoginMutation,
  useMeQuery,
  useLogoutMutation,
} from "@/store/authApi"

export default function App() {
  const { data } = useMeQuery() // гидрация по httpOnly-куке
  const isLoggedIn = Boolean(data?.user)

  const [loginOpen, setLoginOpen] = useState(false)
  const [logout] = useLogoutMutation()

  const openLogin = () => setLoginOpen(true)
  const closeLogin = () => setLoginOpen(false)

  const onLogout = useCallback(async () => {
    try {
      await logout().unwrap()
    } catch (e) {
      console.error(e)
    }
  }, [logout])

  return (
    <div className="app">
      <CssBaseline />
      <Box
        margin="0 auto"
        maxWidth="1400px"
        p="1rem 2rem 4rem 2rem"
        display="flex"
        flexDirection="column"
      >
        <Box display="flex" alignItems="center">
          <NavTabs />
          <Box display="flex" alignItems="center" ml="auto">
            <DropdownButton
              isLoggedIn={isLoggedIn}
              onLoginClick={openLogin}
              onLogoutClick={onLogout}
            />
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

      <AppModal
        open={loginOpen}
        onClose={closeLogin}
        title="Вход"
        maxWidth="xs"
        fullWidth
      >
        <LoginForm onClose={closeLogin} />
      </AppModal>
    </div>
  )
}
