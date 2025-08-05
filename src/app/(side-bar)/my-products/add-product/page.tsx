import { Box, Typography } from "@mui/material";
import { AddProductForm } from "./components/AddProductForm";
import CardContainer from "@/components/cards/CardContainer";
import CardDragAndDrop from "@/components/cards/CardDragAndDrop";
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

      <AddProductForm
        colorOptions={colorOptions}
        brandOptions={brandOptions}
        sizeOptions={sizeOptions}
      />
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
