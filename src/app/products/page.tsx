import { auth } from "@/auth";
import { fetchCategories } from "@/lib/actions/fetch-categories";
import { fetchSizes } from "@/lib/actions/fetch-sizes";
import { fetchColors } from "@/lib/actions/fetch-colors";
import { fetchBrands } from "@/lib/actions/fetch-brands";
import Products from "@/components/Products";

export default async function ProductsPage() {
  const session = await auth();

  const [brandOptions, colorOptions, sizeOptions, categoryOptions] =
    await Promise.all([
      fetchBrands(),
      fetchColors(),
      fetchSizes(),
      fetchCategories(),
    ]);

  return (
    <Products
      brandOptions={brandOptions}
      colorOptions={colorOptions}
      sizeOptions={sizeOptions}
      categoryOptions={categoryOptions}
      session={session}
    />
  );
}
