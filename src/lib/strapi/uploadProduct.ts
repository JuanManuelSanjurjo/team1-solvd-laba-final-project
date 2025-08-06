type ProductFormData = {
  name: string;
  color: number;
  gender: number;
  brand: number;
  description: string;
  price: number;
  sizes: number[];
  images: number[];
  teamName: string;
  userId: number;
};

/**
 * Sends a POST request to create a new product in the Strapi API.
 *
 * Requires a valid JWT token for authentication.
 *
 * @async
 * @function
 * @param {ProductFormData} payload - The product data to be created.
 * @param {string} token - A valid JWT token for authorization.
 * @throws {Error} If the request fails or the response is not OK.
 * @returns {Promise<void>} Resolves when the product is successfully created.
 *
 * @example
 * await createProduct({
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

export async function createProduct(
  payload: ProductFormData,
  token: string
): Promise<void> {
  const res = await fetch(
    "https://shoes-shop-strapi.herokuapp.com/api/products",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) throw new Error("Product creation failed");
}
