import { Modal, Box, Typography, Button, Divider } from "@mui/material";
import { JSX } from "react";

type ConfirmationModalProps = {
  showModal: boolean;
  onClose: () => void;
  title: string;
  text: string;
  secondaryBtn: string;
  primaryBtn: string;
};

/**
 * ConfirmationModal
 *
 * This component is a modal that displays a confirmation message with two buttons.
 *
 * @param showModal - A boolean indicating whether the modal should be displayed.
 * @param onClose - A function to be called when the modal is closed.
 * @param title - The title of the confirmation message.
 * @param text - The text of the confirmation message.
 * @param secondaryBtn - The text of the secondary button.
 * @param primaryBtn - The text of the primary button.
 * @returns {JSX.Element} with the confirmation modal component.
 */

export default function ConfirmationModal({
  showModal,
  onClose,
  title,
  text,
  secondaryBtn,
  primaryBtn,
}: ConfirmationModalProps): JSX.Element {
  return (
    <Modal
      open={showModal}
      onClose={onClose}
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(255, 255, 255, 0.5)",
        },
      }}
      disableScrollLock
    >
      <Box
        sx={{
          position: "absolute",
          display: "grid",
          color: "#292D32",
          gap: 5,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          outline: "none",
          borderRadius: 1,
          boxShadow: 24,
          p: 4,
          width: {
            sx: 320,
            md: 656,
          },
        }}
      >
        <Typography variant="h2" component="h2">
          {title}
        </Typography>
        <Typography sx={{ mt: 2 }}>{text}</Typography>

        <Divider />
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "space-between",
            gap: {
              xs: 1,
              md: 3.75,
            },
          }}
        >
          <Button variant="outlined" onClick={onClose} sx={{ width: "100%" }}>
            {secondaryBtn}
          </Button>
          <Button variant="contained" sx={{ width: "100%" }}>
            {primaryBtn}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
