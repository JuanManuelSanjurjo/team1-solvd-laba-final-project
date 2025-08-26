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
import { JSX, ReactNode } from "react";

type SizeSelectorModalProps = {
  showModal: boolean;
  onClose: (e: React.SyntheticEvent) => void;
  onPrimary: (e: React.MouseEvent<HTMLButtonElement>) => void;
  title: string;
  text?: string;
  secondaryBtn?: string;
  primaryBtn?: string;
  children?: ReactNode; // 👈 agregado
};

/**
 * SizeSelectorModal
 *
 * This component is a modal that can display a custom content (children)
 * with two action buttons.
 *
 * @returns {JSX.Element} with the size selector modal component.
 */

export default function SizeSelectorModal({
  showModal,
  onClose,
  onPrimary,
  title,
  text,
  secondaryBtn,
  primaryBtn,
  children,
}: SizeSelectorModalProps): JSX.Element {
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
      onClick={(e) => e.stopPropagation()}
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
          {title}
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
        <DialogContent sx={{ px: "32px", py: "40px" }}>
          {text && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {text}
            </Typography>
          )}

          {/* 👇 acá renderizamos el contenido extra */}
          {children && <Box mt={text ? 3 : 0}>{children}</Box>}

          <Divider sx={{ pt: "40px" }} />
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
            {primaryBtn || "Confirm"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
