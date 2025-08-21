/**
 * getQueryStringFromFilters
 *
 * This function takes a search term and a list of search fields and populate fields,
 * and returns a URL-encoded query string that can be used to fetch products from the Strapi API.
 *
 * The function iterates through the searchFields array and constructs a filter query using the
 * Strapi `$or` operator and the `$containsi` condition to match any field or nested field
 * (e.g., `color.name`) against the provided search string.
 *
 * It also supports optional population of related fields.
 *
 * @param {string} query - The user-provided search input.
 * @param {string[]} [searchFields=["name"]] - A list of fields (including nested, like `color.name`)
 * to apply the search filter against.
 * @param {string[]} [populateFields=[]] - A list of fields to populate from related entities.
 * Each should be in the form `relation.subfield` (e.g., `color.name`).
 *
 * @returns {string} A URL-encoded query string that can be used to fetch products from the Strapi API.
 */

export function getQueryStringFromFilters(
  query: string,
  searchFields: string[] = ["name"],
  populateFields: string[] = []
): string {
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

  const url = `${
    process.env.NEXT_PUBLIC_API_URL
  }/products?${filters}&filters[teamName][$in]=team-1${
    populate ? `&${populate}` : ""
  }`;

  return url;
}
