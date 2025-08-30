// scenes/Cases.jsx
import * as React from "react";
import {
  Box,
  Grid,
  Typography,
  Fab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useCases } from "@/hooks/useCases";
import CaseCard from "@/components/CaseCard/CaseCard";
import AppModal from "@/components/Modal/AppModal";
import CaseForms from "@/components/CaseForms/CaseForms";
import { useCreateCaseMutation } from "@/store/authApi"; // Импортируем хук для мутации

function makeEmptyCase() {
  return {
    __isNew: true,
    id: undefined,

    object: {
      account: "", // Лицевой счёт
      objectAddress: "", // Адрес объекта
      area: "", // Площадь объекта
    },

    defendants: [
      {
        id: undefined,
        surname: "",
        name: "",
        patronymic: "",
        birthday: "",
        passport: "",
        address: "",
        share: "",
      },
    ],

    debt: {
      principal: "",
      penalty: "",
      total: "",
      duty: "",
      period: {
        from: "",
        to: "",
      },
    },
    court: {
      type: "", // Тип суда
      name: "", // Название суда
      address: "",
      // Добавляем новые поля для дат
      dateSentToDebtor: "",
      dateSentToCourt: "",
      dateAcceptedForReview: "",
      dateDecisionMade: "",
    },
    comments: "", // Комментарии
  };
}

export default function Cases() {
  const { cases, addCase, updateCase, removeCase } = useCases();
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  // Хук для мутации createCase
  const [createCase] = useCreateCaseMutation();

  const handleOpenEdit = (item) => {
    setForm(item);
    setOpen(true);
  };
  const handleOpenCreate = () => {
    setForm(makeEmptyCase());
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const handleExited = () => setForm(null);

  const getNextId = React.useCallback(() => {
    const maxId = cases.length
      ? Math.max(...cases.map((c) => Number(c.id) || 0))
      : 0;
    return maxId + 1;
  }, [cases]);

  const handleSave = async () => {
    if (!form) return;
    try {
      // Если это новый случай, отправляем на сервер через createCase
      if (form.__isNew) {
        const response = await createCase(form).unwrap(); // Используем мутацию для сохранения
        console.log("Case created:", response);
      } else {
        updateCase(form.id, form);
      }
      handleClose();
    } catch (error) {
      console.error("Error saving case:", error);
    }
  };

  const askDelete = () => setConfirmOpen(true);
  const cancelDelete = () => setConfirmOpen(false);
  const confirmDelete = () => {
    setConfirmOpen(false);
    if (form?.id != null) removeCase(form.id);
    handleClose();
  };

  const title = form
    ? form.__isNew
      ? "Новое заявление"
      : `Редактирование заявления`
    : "";

  return (
    <Box sx={{ position: "relative" }}>
      <Typography variant="body2" sx={{ mb: 3, mt: 3 }}>
        Всего заявлений: {cases.length}
      </Typography>

      <Grid container spacing={2}>
        {cases.map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
            <CaseCard item={item} onClick={handleOpenEdit} />
          </Grid>
        ))}
      </Grid>

      <AppModal
        open={open}
        onClose={handleClose}
        onExited={handleExited}
        title={title}
        leftActions={
          !form?.__isNew && (
            <Button
              onClick={askDelete}
              color="error"
              startIcon={<DeleteOutlineIcon />}
              variant="text"
            >
              Удалить
            </Button>
          )
        }
        rightActions={
          <>
            <Button onClick={handleClose} variant="outlined">
              Отмена
            </Button>
            <Button onClick={handleSave} variant="contained">
              Сохранить
            </Button>
          </>
        }
        maxWidth="md"
        fullWidth
      >
        <CaseForms value={form} onChange={setForm} />
      </AppModal>

      <Dialog open={confirmOpen} onClose={cancelDelete}>
        <DialogTitle>Удалить дело?</DialogTitle>
        <DialogContent dividers>
          Подтвердите удаление дела {form?.id ? `#${form.id}` : ""}.
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} variant="outlined">
            Нет
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Да, удалить
          </Button>
        </DialogActions>
      </Dialog>

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
