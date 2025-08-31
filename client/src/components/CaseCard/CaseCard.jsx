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
    .map((d) => {
      const s = d?.surname?.trim() ?? "";
      const n = d?.name ? `${d.name.trim()[0]}.` : "";
      const p = d?.patronymic ? `${d.patronymic.trim()[0]}.` : "";
      return [s, [n, p].filter(Boolean).join("")].filter(Boolean).join(" ");
    })
    .filter(Boolean)
    .join(", ");
}

export default function CaseCard({ item, onClick, onCreateRequest }) {
  const defendantStr = formatDefendants(item?.defendants);
  const claimPrice = Number(item?.debt?.total ?? 0);

  const [menuAnchor, setMenuAnchor] = React.useState(null);
  const openMenu = Boolean(menuAnchor);

  const handleMenuOpen = (e) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
  };
  const handleMenuClose = (e) => {
    e?.stopPropagation?.();
    setMenuAnchor(null);
  };
  const handleCreate = (e) => {
    e.stopPropagation();
    handleMenuClose();
    onCreateRequest(item._id);
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
                {claimPrice.toLocaleString("ru-RU")} ₽
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
            <Typography variant="body1">{defendantStr || "—"}</Typography>
          </Stack>
        </CardContent>
      </CardActionArea>

      {/* Кнопка меню в правом нижнем углу */}
      <IconButton
        aria-label="Доп. действия"
        onClick={handleMenuOpen}
        sx={{ position: "absolute", right: 8, bottom: 8 }}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        anchorEl={menuAnchor}
        open={openMenu}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MenuItem onClick={handleCreate}>Создать заявление</MenuItem>
      </Menu>
    </Card>
  );
}
