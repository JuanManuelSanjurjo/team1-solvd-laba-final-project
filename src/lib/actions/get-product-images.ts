/**
 * getProductImages
 *
 * This function fetches only the product images corresponding to the product ID from the Strapi API.
 *
 * @param {string} id - The product ID.
 * @returns {Promise<ImageData[]>} The product images.
 *
 * @example
 * const images = await getProductImages(params["product-id"]);
 */
export async function getProductImages(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}?populate[images][fields][0]=url&populate[images][fields][1]=name`,
      { cache: "no-store" }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch product images");
    }
    const responseData = await response.json();
    return responseData?.data?.attributes?.images || { data: null };
  } catch (error) {
    console.log(error);
  }
}
