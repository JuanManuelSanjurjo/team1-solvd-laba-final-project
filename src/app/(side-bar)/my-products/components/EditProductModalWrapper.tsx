import { Box, Modal, Fade, Backdrop } from "@mui/material";

/**
 * Props for the EditProductModalWrapper component.
 *
 * @typedef ModalWrapperProps
 * @property {boolean} open - Controls whether the modal is visible.
 * @property {() => void} onClose - Callback fired when the modal is requested to be closed.
 * @property {React.ReactNode} children - The content to display inside the modal.
 */
interface ModalWrapperProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * EditProductModalWrapper
 *
 * A reusable modal wrapper component used for editing products.
 * It provides a styled container with transition effects (fade + backdrop)
 * and handles proper positioning, sizing, and scrollable content.
 *
 * @component
 * @param {ModalWrapperProps} props - The props for the modal wrapper.
 * @returns {JSX.Element} The rendered modal wrapper with its children.
 */

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
