import ProductPageDetails from "../components/ProductPageDetails";
import { normalizeProduct } from "@/lib/normalizers/product-normalizers";
import { getProductDetails } from "@/lib/strapi/get-product-details";

type Params = {
  "product-id": string;
};

/**
 * SingleProduct
 *
 * This function fetches the product details and normalizes the data.
 *
 * @param {Params} params - The URL parameters.
 * @returns {JSX.Element} The product details component.
 */
async function SingleProduct({ params }: { params: Params }) {
  const { data } = await getProductDetails(params["product-id"]);
  const normalizedProduct = normalizeProduct(data);

  return <ProductPageDetails product={normalizedProduct} />;
}

export default SingleProduct;
