interface Size {
  id: number;
  attributes: {
    value: number;
  };
}
/**
 * Fetches shoe sizes from the Strapi API.
 *
 * The response is revalidated every 3600 seconds (1 hour) using Next.js caching.
 * Transforms the API response into an array of objects with `label` and `value`
 * suitable for use in UI components like select inputs or filters.
 *
 * @async
 * @function
 * @throws {Error} If the network request fails or the response is not OK
 * @returns {Promise<{label: number, value: number}[]>} Array of size options
 *
 * @example
 * const sizes = await fetchSizes();
 * // Output: [{ label: 40, value: 1 }, { label: 41, value: 2 }, ...]
 */
export async function fetchSizes() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sizes`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error("Failed to fetch sizes");

  const json = await res.json();

  return json.data.map((size: Size) => ({
    label: size.attributes.value,
    value: size.id,
  }));
}
