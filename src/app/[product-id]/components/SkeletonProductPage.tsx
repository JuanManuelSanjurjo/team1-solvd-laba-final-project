import { Box, Container } from "@mui/material";
import SkeletonGallery from "./SkeletonGallery";
import SkeletonProductDetails from "./SkeletonProductDetails";

export default function ProductPageSkeleton() {
  return (
    <Box marginBlock="100px" paddingInline={{ xs: 4, xl: 0 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: {
            xs: "60px",
            sm: "90px",
            md: "120px",
          },
        }}
      >
        <Container
          disableGutters
          sx={{
            maxWidth: { xs: "95%", md: 1300 },
            display: "flex",
            justifyContent: "center",
            alignItems: {
              xs: "center",
              md: "flex-start",
            },
            flexDirection: {
              xs: "column",
              md: "row",
            },
            gap: "100px",
          }}
        >
          <SkeletonGallery />
          <SkeletonProductDetails />
        </Container>
      </Box>
    </Box>
  );
}
