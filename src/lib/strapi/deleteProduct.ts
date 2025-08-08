/**
 * Deletes a product by ID from the Strapi API.
 *
 * Sends a DELETE request to the API to remove the specified product.
 *
 * @async
 * @function
 * @param {number} productId - The ID of the product to delete
 * @throws {Error} If the network request fails or the response is not OK
 * @returns {Promise<void>} Resolves when the product is successfully deleted
 *
 * @example
 * await deleteProduct(2660);
 */

export async function deleteProduct(
  productId: number,
  token: string
): Promise<void> {
  const res = await fetch(
    `https://shoes-shop-strapi.herokuapp.com/api/products/${productId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to delete product with ID ${productId}`);
  }
}
