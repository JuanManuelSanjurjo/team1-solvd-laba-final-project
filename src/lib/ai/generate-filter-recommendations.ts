/**
 * @function
 * @param {number[]} ids - The product ids to fetch recommendations for.
 * @returns {Promise<Product[]>} - A promise that resolves to an array of product objects.
 *
 * @example
 * const recommendations = await fetchRecommendations([1, 2, 3]);
 * console.log(recommendations); // Output: [{ id: 4, name: "Product 4" }, { id: 5, name: "Product 5" }]
 */
export async function fetchRecommendations(ids: number[]) {
  const res = await fetch("/api/ia/recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) throw new Error("Failed to fetch recommendations");
  return res.json();
}
