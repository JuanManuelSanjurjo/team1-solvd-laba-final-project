import { fetchBrands } from "@/lib/actions/fetch-brands";
import MyProductsBanner from "./components/MyProductsBanner";
import MyProductsMainContent from "./components/MyProductsMainContent";
import { fetchColors } from "@/lib/actions/fetch-colors";
import { fetchSizes } from "@/lib/actions/fetch-sizes";
import { fetchCategories } from "@/lib/actions/fetch-categories";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

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
    <>
      <MyProductsBanner />
      <MyProductsMainContent
        session={session}
        colorOptions={colorOptions}
        brandOptions={brandOptions}
        sizeOptions={sizeOptions}
        categoryOptions={categoryOptions}
      />
    </>
  );
}
