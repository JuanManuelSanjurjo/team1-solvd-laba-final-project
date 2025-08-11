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
) => {
  if (!query.trim()) return [];

  const encoded = encodeURIComponent(query);

  const filters = searchFields
    .map((field, index) => {
      const parts = field.split(".");
      if (parts.length === 1) {
        return `filters[$or][${index}][${parts[0]}][$containsi]=${encoded}`;
      } else {
        const [relation, subfield] = parts;
        return `filters[$or][${index}][${relation}][${subfield}][$containsi]=${encoded}`;
      }
    })
    .join("&");

  const populate = populateFields
    .map((field) => {
      const parts = field.split(".");
      if (parts.length === 1) return "";
      const [relation, subfield] = parts;
      return `populate[${relation}][fields][0]=${subfield}`;
    })
    .join("&");

  const url = `https://shoes-shop-strapi.herokuapp.com/api/products?${filters}${
    populate ? `&${populate}` : ""
  }`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch products");

  const data = await response.json();
  return data.data;
};

export const createQuerystring = (
  query: string,
  searchFields: string[] = ["name"],
  populateFields: string[] = [],
) => {
  if (!query.trim()) return [];

  const encoded = encodeURIComponent(query);

  const filters = searchFields
    .map((field, index) => {
      const parts = field.split(".");
      if (parts.length === 1) {
        return `filters[$or][${index}][${parts[0]}][$containsi]=${encoded}`;
      } else {
        const [relation, subfield] = parts;
        return `filters[$or][${index}][${relation}][${subfield}][$containsi]=${encoded}`;
      }
    })
    .join("&");

  const populate = populateFields
    .map((field) => {
      const parts = field.split(".");
      if (parts.length === 1) return "";
      const [relation, subfield] = parts;
      return `populate[${relation}][fields][0]=${subfield}`;
    })
    .join("&");

  const urlToConcat = `?${filters}${populate ? `&${populate}` : ""}`;

  return urlToConcat;
};
