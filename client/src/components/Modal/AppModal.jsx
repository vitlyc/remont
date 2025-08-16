import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Box,
} from "@mui/material";

export default function AppModal({
  open,
  onClose,
  onExited, // <-- добавили
  title,
  leftActions, // кнопки слева (например, Delete)
  rightActions, // кнопки справа (Cancel/Save)
  maxWidth = "md",
  fullWidth = true,
  children,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      slotProps={{ transition: { onExited } }} // <-- здесь
    >
      {title ? <DialogTitle>{title}</DialogTitle> : null}
      <Divider sx={{ width: "100%" }} />
      <DialogContent>{children}</DialogContent>
      {(leftActions || rightActions) && (
        <DialogActions sx={{ gap: 1, px: 3, pb: 2 }}>
          {leftActions ? <Box sx={{ mr: "auto" }}>{leftActions}</Box> : null}
          {rightActions}
        </DialogActions>
      )}
    </Dialog>
  );
}
