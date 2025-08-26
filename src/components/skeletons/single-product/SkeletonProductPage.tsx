import { Box, Container } from "@mui/material";
import SkeletonGallery from "./SkeletonGallery";
import SkeletonProductDetails from "./SkeletonProductDetails";

/**
 * ProductPageSkeleton
 *
 * This component is a skeleton product page that displays a gallery and product details.
 *
 * @returns {JSX.Element} with the skeleton product page component.
 */

export default function ProductPageSkeleton() {
  return (
    <Box
      marginBlock="100px"
      paddingInline={{ xs: 4, xl: 0 }}
      data-testid="skeleton-product-page"
    >
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
