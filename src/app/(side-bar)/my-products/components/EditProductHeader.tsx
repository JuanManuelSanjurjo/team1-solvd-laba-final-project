import { Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface EditProductHeaderProps {
  onClose: () => void;
}

export function EditProductHeader({ onClose }: EditProductHeaderProps) {
  return (
    <Box sx={{ width: { sm: "100%", md: "60%" } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h2" sx={{ marginBottom: "36px" }}>
          Edit a product
        </Typography>
        <Box sx={{ display: { xs: "block", sm: "none" } }} onClick={onClose}>
          <CloseIcon
            sx={{
              width: "30px",
              height: "30px",
              color: "rgba(73, 73, 73, 1)",
              marginRight: "14px",
              marginTop: "14px",
            }}
          />
        </Box>
      </Box>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ marginBottom: "40px" }}
      >
        Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in
        laying out print, graphic or web designs. The passage is attributed to
        an unknown typesetter in the 15th century who is thought to have
        scrambled parts of Ciceros De Finibus Bonorum et Malorum for use in a
        type specimen book. It usually begins with:
      </Typography>
    </Box>
  );
}
