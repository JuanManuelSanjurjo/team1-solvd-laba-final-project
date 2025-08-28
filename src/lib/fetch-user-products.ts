/**
 * @function
 * @param {number} userId - The user id to fetch products for.
 * @param {string} token - The token to use for authentication.
 * @returns {Promise<Product[]>} - A promise that resolves to an array of product objects.
 *
 * @example
 * const products = await fetchUserProducts(1, "token");
 * console.log(products); // Output: [{ id: 1, name: "Product 1" }, { id: 2, name: "Product 2" }]
 */
export async function fetchUserProducts(userId: number, token: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}?populate[products][populate]=*
`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error("Network response was not ok");
  const json = await response.json();
  return json.products;
}
