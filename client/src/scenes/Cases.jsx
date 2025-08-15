import * as React from "react";
import { Box, Grid, Typography, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useCases } from "@/hooks/useCases";
import CaseCard from "@/components/Card/Card";
import CaseDialog from "@/components/CaseDialog/CaseDialog";

function makeEmptyCase() {
  return {
    __isNew: true, // внутренний флаг — понять, создаём новую или редактируем
    id: undefined, // присвоим при сохранении
    account: "",
    objectAddress: "",
    area: "",
    owners: [
      {
        id: 1,
        surname: "",
        name: "",
        patronymic: "",
        birthday: "",
        passport: "",
        address: "",
        share: "",
      },
    ],
    submission: {
      date: "",
      court: {
        type: "",
        name: "",
        address: "",
      },
      // если у тебя есть блок claim — можешь раскомментировать:
      // claim: { principal: "", penalty: "", total: "", stateDuty: 4000 },
    },
    comments: "",
  };
}

export default function Cases() {
  const { cases, addCase, updateCase, removeCase } = useCases();
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null);

  const handleOpenEdit = (item) => {
    setSelected(item);
    setOpen(true);
  };

  const handleOpenCreate = () => {
    setSelected(makeEmptyCase());
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const handleDelete = (id) => {
    console.log(id);
    removeCase(id);
    // если удаляем текущее — закрываем диалог
    setOpen(false);
    setSelected(null);
  };

  const getNextId = React.useCallback(() => {
    const maxId = cases.length
      ? Math.max(...cases.map((c) => Number(c.id) || 0))
      : 0;
    return maxId + 1;
  }, [cases]);

  const handleSave = (next) => {
    if (next.__isNew) {
      const id = getNextId();
      const toAdd = { ...next, id };
      delete toAdd.__isNew;
      addCase(toAdd);
    } else {
      updateCase(next.id, next);
    }
    handleClose();
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Typography variant="body2" sx={{ mb: 3, mt: 3 }}>
        Всего заявлений: {cases.length}
      </Typography>

      <Grid container spacing={2}>
        {cases.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <CaseCard item={item} onClick={handleOpenEdit} />
          </Grid>
        ))}
      </Grid>

      <CaseDialog
        open={open}
        onClose={handleClose}
        data={selected}
        onSave={handleSave}
        onDelete={handleDelete} // <- вот тут
      />

      {/* Floating Action Button — создать новое дело */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 24, right: 24 }}
        onClick={handleOpenCreate}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}
