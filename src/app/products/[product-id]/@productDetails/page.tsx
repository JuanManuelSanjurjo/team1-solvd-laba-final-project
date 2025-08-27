import { auth } from "@/auth";
import ProductPageDetails from "../components/ProductPageDetails";
import { normalizeProduct } from "@/lib/normalizers/product-normalizers";
import { getProductName } from "@/lib/actions/get-product-name";
import { getProductDetails } from "@/lib/actions/get-product-details";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ "product-id": string }>;
}): Promise<Metadata> {
  const product = await params;
  const { data } = await getProductName(product["product-id"]);

  return {
    title: data?.attributes?.name
      ? `Products | ${data.attributes.name}`
      : "Product | Details",
    description: "Product details",
  };
}
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
