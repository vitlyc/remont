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
import CaseCard from "@/components/CaseCard/CaseCard";
import AppModal from "@/components/Modal/AppModal";
import CaseForms from "@/components/CaseForms/CaseForms";
import { useCreateCaseMutation, useGetUserCasesQuery } from "@/store/authApi";

function makeEmptyCase() {
  return {
    __isNew: true,
    object: {
      account: "",
      objectAddress: "",
      area: "",
    },
    defendants: [
      {
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
      period: { from: "", to: "" },
    },
    court: {
      name: "",
      address: "",
      dateSentToDebtor: "",
      dateSentToCourt: "",
      dateAcceptedForReview: "",
      dateDecisionMade: "",
    },
    comments: "",
  };
}

export default function Cases() {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({});
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  //Mutations
  const [createCase] = useCreateCaseMutation();
  const { data: cases, error, isLoading } = useGetUserCasesQuery();

  const handleOpenCreate = () => {
    setForm(makeEmptyCase());
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const handleExited = () => setForm({});

  const handleSave = async () => {
    try {
      if (form?.__isNew) {
        const response = await createCase(form).unwrap();
        console.log("Case created:", response);
      }
      handleClose();
    } catch (error) {
      console.error("Error saving case:", error);
    }
  };

  const handleOpenEdit = (item) => {
    setForm(item);
    setOpen(true);
  };

  const askDelete = () => setConfirmOpen(true);
  const cancelDelete = () => setConfirmOpen(false);
  const confirmDelete = () => {
    setConfirmOpen(false);
    console.log("Deleting case", form?.id);
    handleClose();
  };

  if (isLoading)
    return <Typography variant="body1">Loading cases...</Typography>;
  if (error)
    return <Typography variant="body1">Error loading cases</Typography>;

  return (
    <Box sx={{ position: "relative" }}>
      <Typography variant="body2" sx={{ mb: 3, mt: 3 }}>
        Всего заявлений: {cases?.length || 0}
      </Typography>

      <Grid container spacing={2}>
        {cases?.map((caseItem) => (
          <Grid item xs={12} sm={6} md={4} key={caseItem._id}>
            <CaseCard
              item={caseItem} // Передаем каждое дело в CaseCard
              onClick={() => handleOpenEdit(caseItem)} // Редактирование дела
            />
          </Grid>
        ))}
      </Grid>

      <AppModal
        open={open}
        onClose={handleClose}
        onExited={handleExited}
        title={form.__isNew ? "Новое заявление" : "Редактирование заявления"}
        leftActions={
          !form.__isNew && (
            <Button
              onClick={askDelete}
              color="error"
              startIcon={<DeleteOutlineIcon />}
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
        <CaseForms form={form} onChange={setForm} />
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
