import * as React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Stack,
} from "@mui/material";

function formatOwners(owners = []) {
  return owners
    .map((o) => {
      const s = o?.surname?.trim() ?? "";
      const n = o?.name ? `${o.name.trim()[0]}.` : "";
      const p = o?.patronymic ? `${o.patronymic.trim()[0]}.` : "";
      return [s, [n, p].filter(Boolean).join("")].filter(Boolean).join(" ");
    })
    .filter(Boolean)
    .join(", ");
}

export default function CaseCard({ item, onClick }) {
  const ownersStr = formatOwners(item?.owners);
  const claimPrice = item?.submission?.claim?.total ?? 0;

  return (
    <Card elevation={2} sx={{ borderRadius: 3 }}>
      <CardActionArea onClick={() => onClick?.(item)}>
        <CardContent>
          <Stack spacing={0.5}>
            <Stack direction="row" spacing={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Лицевой счёт
              </Typography>
              <Typography variant="h6">{item?.account}</Typography>

              {/* Цена иска */}
              <Typography variant="subtitle2" color="text.secondary">
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
            <Typography variant="body1">{item?.objectAddress}</Typography>

            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Ответчики
            </Typography>
            <Typography variant="body1">{ownersStr || "—"}</Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
