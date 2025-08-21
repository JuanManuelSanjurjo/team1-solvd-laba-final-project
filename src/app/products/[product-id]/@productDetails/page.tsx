import ProductPageDetails from "../components/ProductPageDetails";
import { normalizeProduct } from "@/lib/normalizers/product-normalizers";
import { getProductDetails } from "@/lib/strapi/get-product-details";
import { auth } from "@/auth";

/**
 * SingleProduct
 *
 * This function fetches the product details and normalizes the data.
 *
 * @param {Params} params - The URL parameters.
 * @returns {JSX.Element} The product details component.
 */
export default async function SingleProduct({
  params,
}: {
  params: Promise<{ "product-id": string }>;
}) {
  const product = await params;
  const session = await auth();
  const userId = session?.user?.id ?? "";

  const { data } = await getProductDetails(product["product-id"]);
  const normalizedProduct = normalizeProduct(data);

  return <ProductPageDetails userId={userId} product={normalizedProduct} />;
}
