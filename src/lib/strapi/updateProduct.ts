import { ProductFormData } from "@/app/(side-bar)/my-products/add-product/schema";

/**
 * Sends a PUT request to update a product in the Strapi API.
 *
 * Requires a valid JWT token for authentication.
 *
 * @async
 * @function
 * @param {ProductFormData} payload - The product data to be updated
 * @param {string} token - A valid JWT token for authorization.
 * @throws {Error} If the request fails or the response is not OK.
 * @returns {Promise<void>} Resolves when the product is successfully updated.
 *
 * @example
 * await updateProduct({
 *   productId:1403,
 *   name: "Adidas Samba",
 *   color: 1,
 *   gender: 2,
 *   brand: 3,
 *   description: "Awesome shoes.",
 *   price: 120,
 *   teamName: 'team-1',
 *   images: [7800,7802],
 *   sizes: [40, 41, 42],
 *   userId: 7
 * }, "your-jwt-token");
 */

export async function updateProduct(
  productId: number,
  updatedFields: Partial<ProductFormData>,
  token: string
): Promise<void> {
  const res = await fetch(
    `https://shoes-shop-strapi.herokuapp.com/api/products/${productId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: updatedFields,
      }),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.message || "Failed to update product");
  }
}
