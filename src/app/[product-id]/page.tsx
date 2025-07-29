import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Box, Container } from "@mui/material";
import ProductPageDetails from "./components/ProductPageDetails";
// import Gallery from "@/components/gallery/Gallery";
const Gallery = dynamic(() => import("@/components/gallery/Gallery"));

// Can delete evereything below, just for testing porpuses

type Params = {
  ["product-id"]: string;
};
type ImageData = {
  attributes: {
    url: string;
    name: string;
  };
};
async function getProductDetails(id: string) {
  try {
    const response = await fetch(
      `https://shoes-shop-strapi.herokuapp.com/api/products/${id}?fields[0]=name&fields[1]=description&fields[2]=price&populate[color][fields][0]=name&populate[sizes][fields][0]=value`,
      { cache: "no-store" },
    );
    const responseData = await response.json();
    return responseData.data;
  } catch (error) {
    console.log(error); // placeholder for error handling
  }
}
async function getProductImages(id: string) {
  try {
    const response = await fetch(
      `https://shoes-shop-strapi.herokuapp.com/api/products/${id}?populate[images][fields][0]=url&populate[images][fields][1]=name`,
      { cache: "no-store" },
    );
    const responseData = await response.json();
    return responseData.data.attributes.images;
  } catch (error) {
    console.log(error); // placeholder for error handling
  }
}

async function SingleProduct({ params }: { params: Params }) {
  const { attributes: product } = await getProductDetails(params["product-id"]);
  const { data: imagesArr } = await getProductImages(params["product-id"]);

  const images = imagesArr?.map((img: ImageData) => ({
    url: img?.attributes?.url,
    alt: img?.attributes?.name,
  }));

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
            gap: "100px",
          }}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <Box width="100%">
              <Gallery images={images} />
            </Box>
          </Suspense>
          <ProductPageDetails product={product} />
        </Container>
      </Box>
    </Box>
  );
}

export default SingleProduct;
