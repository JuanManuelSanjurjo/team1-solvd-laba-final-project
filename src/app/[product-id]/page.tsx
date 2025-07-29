import Gallery from "@/components/gallery/Gallery";
import { Box, Container } from "@mui/material";
import ProductPageDetails from "./components/ProductPageDetails";

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
      `https://shoes-shop-strapi.herokuapp.com/api/products/${id}?fields[0]=name&fields[1]=description&fields[2]=price&populate[color][fields][0]=name&populate[sizes][fields][0]=value&populate[images][fields][0]=url&populate[images][fields][1]=name`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error); // placeholder for error handling
  }
}

export default async function SingleProduct({ params }: { params: Params }) {
  const {
    data: { attributes: product },
  } = await getProductDetails(params["product-id"]);
  const images = product.images?.data?.map((img: ImageData) => ({
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
          <Box width="100%">
            <Gallery images={images} />
          </Box>
          <ProductPageDetails product={product} />
        </Container>
      </Box>
    </Box>
  );
}
