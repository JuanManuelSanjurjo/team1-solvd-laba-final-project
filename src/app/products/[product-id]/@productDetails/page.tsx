import { auth } from "@/auth";
import ProductPageDetails from "../components/ProductPageDetails";
import { normalizeProduct } from "@/lib/normalizers/product-normalizers";
import { getProductDetails } from "@/lib/strapi/get-product-details";

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
  const session = await auth();
  const product = await params;

  const { data } = await getProductDetails(product["product-id"]);
  const normalizedProduct = normalizeProduct(data);

  return <ProductPageDetails session={session} product={normalizedProduct} />;
}
