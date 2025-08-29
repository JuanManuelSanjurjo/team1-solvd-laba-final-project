const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const MAX = 100;

/**
 * Verifies a list of product IDs against Strapi and returns only those that exist.
 *
 * How it works:
 * - Splits the incoming `ids` into chunks of size `MAX`.
 * - Calls `/api/products` using `filters[id][$in]` and requests only the `id` field.
 * - Accumulates the found IDs, then **preserves input order** by filtering the original `ids`.
 * - Uses `cache: "no-store"` to avoid cached responses.
 * - **Does not throw:** logs errors and continues with remaining chunks if any request fails.
 *
 * @param {number[]} ids - Product IDs to validate against Strapi.
 * @returns {Promise<number[]>} A promise resolving to the subset of `ids` that exist (same order as input).
 *
 * @example
 * // If ID 2 no longer exists in Strapi:
 * const activeIds = await fetchActiveProductsIds([1, 2, 3]);
 * // => [1, 3]
 *
 */
export async function fetchActiveProductsIds(ids: number[]): Promise<number[]> {
  if (!ids.length) return [];

  const found = new Set<number>();

  for (let i = 0; i < ids.length; i += MAX) {
    const chunk = ids.slice(i, i + MAX);

    const qs = new URLSearchParams();
    qs.append("fields[0]", "id");

    chunk.forEach((id, idx) => {
      qs.append(`filters[id][$in][${idx}]`, String(id));
    });

    qs.append("pagination[pageSize]", String(chunk.length));
    qs.append("pagination[withCount]", "false");

    const url = `${BASE_URL}/products?${qs.toString()}`;

    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`Error fetching product ids: ${res.status}`);

      const json: { data?: Array<{ id: number }> } = await res.json();
      (json.data ?? []).forEach(({ id }) => found.add(Number(id)));
    } catch (err) {
      console.error("Error fetching product ids:", err);
    }
  }

  return ids.filter((id) => found.has(id));
}
