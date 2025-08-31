// components/CaseCard/CaseCard.jsx
import * as React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Stack,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function formatDefendants(defendants = []) {
  return defendants
    .map((defendant) => {
      const s = defendant?.surname?.trim() ?? "";
      const n = defendant?.name ? `${defendant.name.trim()[0]}.` : "";
      const p = defendant?.patronymic
        ? `${defendant.patronymic.trim()[0]}.`
        : "";
      return [s, [n, p].filter(Boolean).join("")].filter(Boolean).join(" ");
    })
    .filter(Boolean)
    .join(", ");
}

export default function CaseCard({ item, onClick, onCreateRequest }) {
  const defandantsStr = formatDefendants(item?.defendants);
  const claimPrice = item?.debt?.total ?? 0;

  const [menuAnchor, setMenuAnchor] = React.useState(null);
  const openMenu = Boolean(menuAnchor);

  const handleMenuOpen = (e) => {
    e.stopPropagation(); // не кликать CardActionArea
    setMenuAnchor(e.currentTarget);
  };
  const handleMenuClose = (e) => {
    e?.stopPropagation?.();
    setMenuAnchor(null);
  };
  const handleCreate = (e) => {
    e.stopPropagation();
    handleMenuClose();
    onCreateRequest?.(item);
  };

  return (
    <Card elevation={2} sx={{ borderRadius: 3, position: "relative" }}>
      <CardActionArea onClick={() => onClick?.(item)}>
        <CardContent>
          <Stack spacing={0.5}>
            <Stack
              direction="row"
              spacing={2}
              alignItems="baseline"
              flexWrap="wrap"
            >
              <Typography variant="subtitle2" color="text.secondary">
                Лицевой счёт
              </Typography>
              <Typography variant="h6">{item?.object?.account}</Typography>

              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ ml: { xs: 0, sm: 2 } }}
              >
                Цена иска
              </Typography>
              <Typography variant="body1">
                {Number(claimPrice).toLocaleString("ru-RU")} ₽
              </Typography>
            </Stack>

            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Адрес объекта
            </Typography>
            <Typography variant="body1">
              {item?.object?.objectAddress}
            </Typography>

            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Ответчики
            </Typography>
            <Typography variant="body1">{defandantsStr || "—"}</Typography>
          </Stack>
        </CardContent>
      </CardActionArea>

      {/* Кнопка меню в правом нижнем углу */}
      <IconButton
        aria-label="доп. действия"
        onClick={handleMenuOpen}
        sx={{ position: "absolute", right: 8, bottom: 8 }}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        anchorEl={menuAnchor}
        open={openMenu}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
        // чтобы клики в меню не пробивали на CardActionArea
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={handleCreate}>Создать заявление</MenuItem>
      </Menu>
    </Card>
  );
}
