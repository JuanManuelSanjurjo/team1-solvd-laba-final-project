import { getQueryStringFromFilters } from "@/lib/get-query-string-from-filters";

/**
 * Fetches products from the Strapi API by performing a case-insensitive search across one or more fields.
 *
 * Constructs a dynamic filter query using the `$or` operator and the `$containsi` condition
 * to match any field or nested field (e.g., `color.name`) against the provided search string.
 * Also supports optional population of related fields.
 *
 * @param {string} query - The user-provided search input.
 * @param {string[]} [searchFields=["name"]] - A list of fields (including nested, like `color.name`)
 * to apply the search filter against.
 * @param {string[]} [populateFields=[]] - A list of fields to populate from related entities.
 * Each should be in the form `relation.subfield` (e.g., `color.name`).
 *
 * @returns {Promise<any[]>} - A promise that resolves to an array of matching product objects from the API.
 * Returns an empty array if the query is empty or whitespace.
 *
 * @throws {Error} - Throws an error if the fetch request fails or receives a non-OK response.
 */

export const fetchProductsBySearch = async (
  query: string,
  searchFields: string[] = ["name"],
  populateFields: string[] = [],
  pageNumber?: number,
  pageSize?: number
) => {
  if (!query.trim()) return [];

  let url = getQueryStringFromFilters(query, searchFields, populateFields);

  url += `${
    pageSize
      ? `&pagination[page]=${pageNumber}&pagination[pageSize]=${pageSize}`
      : ""
  }`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch products");
  const data = await response.json();
  return data.data;
};
