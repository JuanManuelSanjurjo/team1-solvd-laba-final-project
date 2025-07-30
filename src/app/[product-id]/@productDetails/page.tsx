import ProductPageDetails from "../components/ProductPageDetails";

type Params = {
  ["product-id"]: string;
};
async function getProductDetails(id: string) {
  try {
    const response = await fetch(
      `https://shoes-shop-strapi.herokuapp.com/api/products/${id}?fields[0]=name&fields[1]=description&fields[2]=price&populate[color][fields][0]=name&populate[sizes][fields][0]=value`,
      { cache: "no-store" },
    );
    const responseData = await response.json();
    return responseData.data;
  } catch (error) {
    console.log(error); // placeholder for error handling
  }
}
async function SingleProduct({ params }: { params: Params }) {
  const { attributes: product } = await getProductDetails(params["product-id"]);

  return <ProductPageDetails product={product} />;
}

export default SingleProduct;
