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
} from "@mui/material";
import { Add } from "iconsax-react";
import { useState } from "react";

export default function DeleteProductModal() {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle
        sx={{ m: 0, p: "32px 0 0 32px", fontSize: "45px", fontWeight: "500" }}
        id="customized-dialog-title"
      >
        Are you sure to delete product image
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 24,
          top: 24,
          zIndex: 50,
          rotate: 45,
        }}
      >
        <Add color="#2F2E2D" size={32} style={{ transform: "rotate(45deg)" }} />
      </IconButton>
      <DialogContent sx={{ px: "32px", py: "56px" }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Lorem ipsum dolor sit amet consectetur. Sed imperdiet tempor facilisi
          massa aliquet sit habitant. Lorem ipsum dolor sit amet consectetur.
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
          onClick={handleClose}
          fullWidth
          variant="outlined"
          size="extraLarge"
        >
          Cancel
        </Button>
        <Button fullWidth variant="contained" size="extraLarge">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
