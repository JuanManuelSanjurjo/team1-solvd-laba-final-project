import { ReactNode } from "react";
import { Container, Box } from "@mui/material";

interface ProductLayoutProps {
  children?: ReactNode;
  productDetails: ReactNode;
  gallery: ReactNode;
}

/**
 * ProductLayout
 *
 * This component is a layout for a product page. It displays the product details and gallery.
 *
 * @param {ReactNode} props.children - The children components to be rendered in this case the page.tsx file which we don't want.
 * @param {ReactNode} props.productDetails - The product details component.
 * @param {ReactNode} props.gallery - The gallery component.
 * @returns {JSX.Element} The product layout component.
 *
 * @example
 * <ProductLayout productDetails={<ProductPageDetails product={product} />} gallery={<ProductPageGallery images={images} />} />
 */
export default function ProductLayout({
  productDetails,
  gallery,
}: ProductLayoutProps) {
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
              lg: "flex-start",
            },
            flexDirection: {
              xs: "column",
              lg: "row",
            },
            gap: {
              xs: 8,
              lg: "100px",
            },
          }}
        >
          <Box width="100%">{gallery}</Box>
          {productDetails}
        </Container>
      </Box>
    </Box>
  );
}
