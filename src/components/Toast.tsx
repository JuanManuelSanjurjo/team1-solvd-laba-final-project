import {
  Alert,
  AlertProps,
  Snackbar,
  SnackbarCloseReason,
} from "@mui/material";

interface ToastProps {
  open: boolean;
  onClose: (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => void;
  severity: AlertProps["severity"];
  message: string;
  autoHideDuration?: number;
}

/**
 * @component
 * @param {ToastProps} props - Props for the toast component
 * @param {boolean} props.open - Indicates if the toast is currently open.
 * @param {function} props.onClose - Function to call when the toast is closed.
 * @param {AlertProps["severity"]} props.severity - The severity level of the toast (e.g. "success", "error").
 * @param {string} props.message - The message to display in the toast.
 * @param {number} [props.autoHideDuration=5000] - The duration in milliseconds for which the toast should be visible.
 * @returns {JSX.Element} - The rendered toast component.
 *
 * @example
 * <Toast
 *   open={true}
 *   onClose={handleClose}
 *   severity="success"
 *   message="Operation completed successfully"
 * />
 */
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
