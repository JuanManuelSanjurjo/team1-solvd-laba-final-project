import { Box, Typography } from "@mui/material";
import { AddProductForm } from "./components/AddProductForm";
import { fetchBrands } from "@/lib/strapi/fetch-brands";
import { fetchColors } from "@/lib/strapi/fetch-colors";
import { fetchSizes } from "@/lib/strapi/fetch-sizes";
import Button from "@/components/Button";
import { Metadata } from "next";
import { fetchCategories } from "@/lib/strapi/fetch-categories";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: `Add new product | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
};

export default async function AddProduct() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const [brandOptions, colorOptions, sizeOptions, categoryOptions] =
    await Promise.all([
      fetchBrands(),
      fetchColors(),
      fetchSizes(),
      fetchCategories(),
    ]);
  return (
    <Box sx={{ margin: "0 20px" }}>
      <Box sx={{ width: { sm: "100%", md: "60%" } }}>
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
          scrambled parts of Ciceros De Finibus Bonorum et Malorum for use in a
          type specimen book. It usually begins with:
        </Typography>
      </Box>

      <AddProductForm
        session={session}
        colorOptions={colorOptions}
        brandOptions={brandOptions}
        sizeOptions={sizeOptions}
        categoryOptions={categoryOptions}
      />
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          sx={{
            position: { md: "absolute", sm: "static" },
            top: { md: "150px" },
            right: { md: "60px" },
            width: { md: "120px", sm: "60%", xs: "80%" },
          }}
          form="add-product-form"
          type="submit"
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}
