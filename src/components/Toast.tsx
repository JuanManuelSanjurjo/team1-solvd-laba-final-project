import {
  Alert,
  AlertProps,
  Snackbar,
  SnackbarCloseReason,
} from "@mui/material";

interface ToastProps {
  open: boolean;
  onClose: (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => void;
  severity: AlertProps["severity"];
  message: string;
  autoHideDuration?: number;
}

export default function Toast({
  open,
  onClose,
  severity,
  message,
  autoHideDuration = 5000,
}: ToastProps) {
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    onClose(event, reason);
  };

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%", color: "primary.contrastText" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}