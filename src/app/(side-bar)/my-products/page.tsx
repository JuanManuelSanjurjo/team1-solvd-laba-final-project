import { fetchBrands } from "@/lib/strapi/fetchBrands";
import MyProductsBanner from "./components/MyProductsBanner";
import MyProductsMainContent from "./components/MyProductsMainContent";
import { fetchColors } from "@/lib/strapi/fetchColors";
import { fetchSizes } from "@/lib/strapi/fetchSizes";

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
  const [brandOptions, colorOptions, sizeOptions] = await Promise.all([
    fetchBrands(),
    fetchColors(),
    fetchSizes(),
  ]);
  return (
    <>
      <MyProductsBanner />
      <MyProductsMainContent
        colorOptions={colorOptions}
        brandOptions={brandOptions}
        sizeOptions={sizeOptions}
      />
    </>
  );
}
