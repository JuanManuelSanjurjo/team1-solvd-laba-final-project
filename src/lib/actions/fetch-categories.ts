import { Category } from "iconsax-react";

interface Category {
  id: number;
  attributes: {
    name: string;
  };
}

/**
 * Fetches shoe categories from the Strapi API.
 *
 * The response is revalidated every 3600 seconds (1 hour) using Next.js caching.
 * Transforms the API response into an array of objects with `label` and `value`
 * suitable for use in UI components like select inputs or filters.
 *
 * @async
 * @function
 * @throws {Error} If the network request fails or the response is not OK
 * @returns {Promise<{label: string, value: number}[]>} Array of brand options
 *
 * @example
 * const brands = await fetchCategories();
 * // Output: [{ label: "Shoes", value: 1 }, { label: "Nike", value: 2 }, ...]
 */

export async function fetchCategories() {
  const res = await fetch(
    "https://shoes-shop-strapi.herokuapp.com/api/categories",
    {
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch categories");

  const json = await res.json();

  return json.data.map((category: Category) => ({
    label: category.attributes.name,
    value: category.id,
  }));
}
