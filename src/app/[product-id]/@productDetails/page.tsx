import ProductPageDetails from "../components/ProductPageDetails";
import { normalizeProduct } from "../types/types";
type Params = {
  "product-id": string;
};
async function getProductDetails(id: string) {
  try {
    const response = await fetch(
      `https://shoes-shop-strapi.herokuapp.com/api/products/${id}?fields[0]=name&fields[1]=description&fields[2]=price&populate[color][fields][0]=name&populate[sizes][fields][0]=value`,
      { cache: "no-store" },
    );
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error); // placeholder for error handling
  }
}
async function SingleProduct({ params }: { params: Params }) {
  const { data } = await getProductDetails(params["product-id"]);
  const normalizedProduct = normalizeProduct(data);

  return <ProductPageDetails product={normalizedProduct} />;
}

export default SingleProduct;
