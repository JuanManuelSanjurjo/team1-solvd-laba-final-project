const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Verifies a list of product IDs against Strapi and returns only those that exist.
 *
 * - Deduplicates input IDs to build a compact `$in` query.
 * - Calls `/products` requesting only the `id` field.
 * - Collects found IDs in a Set and **preserves input order** in the result.
 * - Uses `cache: "no-store"` to avoid cached responses.
 * - **Does not throw:** logs errors and returns what could be confirmed.
 *
 * @param {number[]} ids - Product IDs to validate against Strapi.
 * @returns {Promise<number[]>} Subset of `ids` that exist (same order as input).
 *
 * @example
 * // If ID 2 no longer exists in Strapi:
 * const activeIds = await fetchActiveProductsIds([1, 2, 3]);
 * // => [1, 3]
 */
export async function fetchActiveProductsIds(ids: number[]): Promise<number[]> {
  if (!ids.length) return [];

  const uniqueIds = Array.from(new Set(ids));

  const qs = new URLSearchParams();
  qs.append("fields[0]", "id");

  uniqueIds.forEach((id, idx) => {
    qs.append(`filters[id][$in][${idx}]`, String(id));
  });

  qs.append("pagination[pageSize]", String(uniqueIds.length));
  qs.append("pagination[withCount]", "false");

  const url = `${BASE_URL}/products?${qs.toString()}`;

  const found = new Set<number>();

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Error fetching product ids: ${res.status}`);

    const json: { data?: Array<{ id: number | string }> } = await res.json();
    (json.data ?? []).forEach(({ id }) => {
      found.add(Number(id));
    });
  } catch (err) {
    console.error("Error fetching product ids:", err);
  }

  return ids.filter((id) => found.has(id));
}
