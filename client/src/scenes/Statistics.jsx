import * as React from "react";
import { Box, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useCases } from "@/hooks/useCases";

const MONTH_LABELS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

export default function Statistics() {
  const { cases } = useCases();

  // Подсчитываем кол-во поданных заявлений по месяцам из submission.date (дд.мм.гггг)
  const counts = React.useMemo(() => {
    const arr = Array(12).fill(0);
    for (const c of cases) {
      const dateStr = c?.submission?.date?.trim?.();
      if (!dateStr) continue;
      const parts = dateStr.split(".");
      if (parts.length !== 3) continue;
      const m = parseInt(parts[1], 10); // месяц
      if (Number.isInteger(m) && m >= 1 && m <= 12) {
        arr[m - 1] += 1;
      }
    }
    return arr;
  }, [cases]);

  return (
    <Box>
      <LineChart
        height={320}
        xAxis={[{ scaleType: "point", data: MONTH_LABELS }]}
        series={[
          {
            label: "Подано заявлений",
            data: counts,
          },
        ]}
        // Небольшие отступы, чтобы подписи не упирались в края
        margin={{ left: 10, right: 50, top: 20, bottom: 30 }}
      />
    </Box>
  );
}
