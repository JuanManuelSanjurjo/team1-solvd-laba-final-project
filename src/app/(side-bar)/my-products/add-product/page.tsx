import { Box, Typography } from "@mui/material";
import { AddProductForm } from "./components/AddProductForm";
import { AddProductHeader } from "./components/AddProductHeader";
import CardContainer from "@/components/cards/CardContainer";
import CardDragAndDrop from "@/components/cards/CardDragAndDrop";
import CardImage from "@/components/cards/CardImage";
import Card from "@/components/cards/Card";
import { fetchBrands } from "@/lib/strapi/fetchBrands";
import { fetchColors } from "@/lib/strapi/fetchColors";
import { fetchSizes } from "@/lib/strapi/fetchSizes";

export default async function AddProduct() {
  const [brandOptions, colorOptions, sizeOptions] = await Promise.all([
    fetchBrands(),
    fetchColors(),
    fetchSizes(),
  ]);
  return (
    <Box sx={{ margin: "0 20px" }}>
      <Typography variant="h2" sx={{ marginBottom: "36px" }}>
        Add a product
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ marginBottom: "40px" }}
      >
        Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in
        laying out print, graphic or web designs. The passage is attributed to
        an unknown typesetter in the 15th century who is thought to have
        scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a
        type specimen book. It usually begins with:
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: "60px",
          flexDirection: { xs: "column", sm: "column", md: "row" },
        }}
      >
        <AddProductForm
          colorOptions={colorOptions}
          brandOptions={brandOptions}
          sizeOptions={sizeOptions}
        />
        <Box sx={{ flex: 1 }}>
          <Typography
            component="label"
            variant="body2"
            color="#494949"
            sx={{ marginBottom: "8px" }}
          >
            Product images
          </Typography>
          <CardContainer>
            <Card image="https://media.istockphoto.com/id/1306254732/photo/white-sneaker-on-a-orange-and-pink-gradient-background-mens-fashion-sport-shoe-sneakers.jpg?s=1024x1024&w=is&k=20&c=LWqhEyZvLL4Nk61rB1helELau2e7AhnxbhghhQ9f57k=" />
            <Card image="https://media.istockphoto.com/id/1306254732/photo/white-sneaker-on-a-orange-and-pink-gradient-background-mens-fashion-sport-shoe-sneakers.jpg?s=1024x1024&w=is&k=20&c=LWqhEyZvLL4Nk61rB1helELau2e7AhnxbhghhQ9f57k=" />
            <Card image="https://media.istockphoto.com/id/1306254732/photo/white-sneaker-on-a-orange-and-pink-gradient-background-mens-fashion-sport-shoe-sneakers.jpg?s=1024x1024&w=is&k=20&c=LWqhEyZvLL4Nk61rB1helELau2e7AhnxbhghhQ9f57k=" />
            <CardDragAndDrop />
          </CardContainer>
        </Box>
      </Box>
    </Box>
  );
}
/*{
  "data": {
    "name": "Neke Air Test",
    "description": "12ea",
    "price": 10,
    "teamName": "team-1",
    "images": [7008],
    "brand": 9,
    "categories": [5],
    "color": 8,
    "gender": 3,
    "sizes": [14]
  }
}*/
