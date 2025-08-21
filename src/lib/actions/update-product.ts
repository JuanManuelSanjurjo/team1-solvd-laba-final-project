type ProductFormData = {
  data: {
    name: string;
    color: number;
    gender: number;
    brand: number;
    description: string;
    price: number;
    sizes: number[];
    images: number[];
    categories: number;
    teamName: string;
    userID: number;
  };
};
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
    `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedFields),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.message || "Failed to update product");
  }
}
