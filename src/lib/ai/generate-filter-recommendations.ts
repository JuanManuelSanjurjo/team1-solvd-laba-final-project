/**
 * Fetches product recommendations given an array of product IDs.
 *
 * Sends a POST request to `/api/ia/recommendations` with body `{ ids }`
 * and returns the parsed JSON response. Throws when `res.ok` is false.
 *
 * @param {number[]} ids - Product IDs to use for generating recommendations.
 * @returns {Promise<any>} JSON from the recommendations endpoint.
 *
 *  {
 *   "redirectUrl": "/?brand=Adidas&brand=Puma&categories=Casual&color=Black&color=White&size=42&size=43&gender=Men&priceMin=40&priceMax=190",
 *   "ai": {
 *       "brands": [
 *           "Adidas",
 *           "Puma"
 *       ],
 *       "colors": [
 *           "Black",
 *           "White"
 *       ],
 *       "categories": [
 *           "Casual"
 *       ],
 *       "sizes": [
 *           42,
 *           43
 *       ],
 *       "genders": [
 *           "Men"
 *       ],
 *       "price_min": 40,
 *       "price_max": 190,
 *       "explain_short": "Recommendations based on your recently viewed products, focusing on similar attributes and an expanded price range.",
 *       "searchTerm": ""
 *   }
 * }
 *
 * @throws {Error} if the network request fails (non-ok response).
 *
 * @example
 * const recs = await fetchRecommendations([123, 456, 212, 456, 223, 556]);
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
