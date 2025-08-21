/**
 * getProductDetails
 *
 * This function fetches the product details from the Strapi API.
 *
 * @param {string} id - The product ID.
 * @returns {Promise<ProductApiResponse>} The product details.
 *
 * @example
 * const product = await getProductDetails(params["product-id"]);
 */
export async function getProductDetails(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}?fields[0]=name&fields[1]=price&fields[2]=description
      &populate[color][fields][0]=name&populate[sizes][fields][0]=value&populate[images][fields][0]=url&populate[gender][fields][0]=name`,
      { cache: "no-store" },
    );
    if (!response.ok) {
      throw new Error("Failed to fetch product details");
    }
    const responseData = await response.json();
    return responseData || { data: null };
  } catch (error) {
    console.log(error); // placeholder for error handling
  }
}
