import { fetchBrands } from "@/lib/strapi/fetch-brands";
import MyProductsBanner from "./components/MyProductsBanner";
import MyProductsMainContent from "./components/MyProductsMainContent";
import { fetchColors } from "@/lib/strapi/fetch-colors";
import { fetchSizes } from "@/lib/strapi/fetch-sizes";
import { fetchCategories } from "@/lib/strapi/fetch-categories";

/**
 * MyProducts
 *
 * This component renders the main content of the My Products page.
 * It includes a banner, a main content section, and a sidebar.
 *
 * @component
 *
 * @returns {JSX.Element} The main content of the My Products page.
 */
export default async function MyProductsPage() {
  const [brandOptions, colorOptions, sizeOptions, categoryOptions] =
    await Promise.all([
      fetchBrands(),
      fetchColors(),
      fetchSizes(),
      fetchCategories(),
    ]);
  return (
    <>
      <MyProductsBanner />
      <MyProductsMainContent
        colorOptions={colorOptions}
        brandOptions={brandOptions}
        sizeOptions={sizeOptions}
        categoryOptions={categoryOptions}
      />
    </>
  );
}
