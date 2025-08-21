"use client";
import Button from "@/components/Button";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { Add } from "iconsax-react";
import { JSX } from "react";

type ConfirmationModalProps = {
  showModal: boolean;
  onClose: (e: React.SyntheticEvent) => void;
  onPrimary: (e: React.MouseEvent<HTMLButtonElement>) => void;
  title: string;
  text: string;
  secondaryBtn: string;
  primaryBtn: string;
};

/**
 * SizeSelectorModal
 *
 * This component is a modal that displays a select with all shoe sizes with two buttons.
 * both buttons are currently hardcoded to always be closed by default until we implement the functionality.
 *
 * @param showModal - A boolean indicating whether the modal should be displayed.
 * @param onClose - A function to be called when the modal is closed.
 * @param onPrimary - A function that is applied when the button is clicked
 * @param title - The title of the confirmation message.
 * @param text - The text of the confirmation message.
 * @param secondaryBtn - The text of the secondary button.
 * @param primaryBtn - The text of the primary button.
 * @returns {JSX.Element} with the confirmation modal component.
 */

export default function SizeSelectorModal({
  showModal,
  onClose,
  onPrimary,
  title,
  text,
  secondaryBtn,
  primaryBtn,
}: ConfirmationModalProps): JSX.Element {
  return (
    <Dialog
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.2)", // lighter backdrop
            backdropFilter: "blur(3px)", // blur effect
          },
        },
      }}
      disableScrollLock
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={showModal}
      maxWidth={false}
      sx={{
        "& .MuiPaper-root": {
          margin: 0,
        },
      }}
    >
      <Box
        sx={{
          width: {
            xs: 320,
            md: 656,
          },
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: "32px 32px 0 32px",
            textWrap: {
              xs: "balance",
              md: "wrap",
            },
            fontSize: { xs: 30, md: 45 },
            fontWeight: "500",
          }}
          id="customized-dialog-title"
        >
          {title || "Are you sure to delete product image"}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 24,
            top: 24,
            zIndex: 50,
            rotate: 45,
          }}
        >
          <Add
            color="#2F2E2D"
            size={32}
            style={{ transform: "rotate(45deg)" }}
          />
        </IconButton>
        <DialogContent sx={{ px: "32px", py: "56px" }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {text ||
              "Lorem ipsum dolor sit amet consectetur. Sed imperdiet tempor facilisi massa aliquet sit habitant. Lorem ipsum dolor sit amet consectetur."}
          </Typography>
          <Divider sx={{ pt: "56px" }} />
        </DialogContent>
        <DialogActions
          sx={{
            px: "32px",
            pb: "32px",
            pt: "0",
            width: "100%",
          }}
        >
          <Button
            onClick={onClose}
            fullWidth
            variant="outlined"
            size="extraLarge"
          >
            {secondaryBtn || "Cancel"}
          </Button>
          <Button
            fullWidth
            variant="contained"
            size="extraLarge"
            onClick={onPrimary}
          >
            {primaryBtn || "Delete"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
