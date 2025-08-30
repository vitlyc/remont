import * as React from "react";
import { Grid, TextField, Button, Stack } from "@mui/material";
import { useLoginMutation } from "@/store/authApi";

export default function LoginForm({ onClose, onSuccess }) {
  const [form, setForm] = React.useState({ email: "", password: "" });
  const [login, { isLoading, data }] = useLoginMutation();

  const set = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  const submit = async () => {
    try {
      const res = await login(form).unwrap(); // POST /users/login
      onSuccess?.(res);
      onClose?.();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Stack spacing={2}>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={set("email")}
            fullWidth
            autoFocus
          />
        </Grid>
        <Grid xs={12}>
          <TextField
            label="Пароль"
            type="password"
            value={form.password}
            onChange={set("password")}
            fullWidth
          />
        </Grid>
      </Grid>

      <Stack direction="row" justifyContent="flex-end" gap={1}>
        <Button onClick={onClose} variant="outlined">
          Отмена
        </Button>
        <Button onClick={submit} variant="contained" disabled={isLoading}>
          Войти
        </Button>
      </Stack>
    </Stack>
  );
}
