interface Color {
  id: number;
  attributes: {
    name: string;
  };
}

/**
 * Fetches shoe colors from the Strapi API.
 *
 * The response is revalidated every 3600 seconds (1 hour) using Next.js caching.
 * Transforms the API response into an array of objects with `label` and `value`
 * suitable for use in UI components like dropdowns or filters.
 *
 * @async
 * @function
 * @throws {Error} If the network request fails or the response is not OK
 * @returns {Promise<{label: string, value: number}[]>} Array of color options
 *
 * @example
 * const colors = await fetchColors();
 * // Output: [{ label: "Red", value: 1 }, { label: "Blue", value: 2 }, ...]
 */

export async function fetchColors() {
  const res = await fetch(
    `https://shoes-shop-strapi.herokuapp.com/api/colors`,
    {
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch colors");

  const json = await res.json();

  return json.data.map((color: Color) => ({
    label: color.attributes.name,
    value: color.id,
  }));
}
