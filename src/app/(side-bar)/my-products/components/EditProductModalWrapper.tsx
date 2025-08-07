import { Box, Modal, Fade, Backdrop } from "@mui/material";

interface ModalWrapperProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const EditProductModalWrapper: React.FC<ModalWrapperProps> = ({
  open,
  onClose,
  children,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 300,
        },
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "100%", sm: "75%" },
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: { xs: 2, md: 4 },
            maxHeight: { xs: "100vh", sm: "95vh" },
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </Box>
      </Fade>
    </Modal>
  );
};
