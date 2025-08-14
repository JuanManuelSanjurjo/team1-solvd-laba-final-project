export function getQueryStringFromSearchTerm(
  query: string,
  searchFields: string[] = ["name"],
  populateFields: string[] = [],
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

  const url = `https://shoes-shop-strapi.herokuapp.com/api/products?${filters}${populate ? `&${populate}` : ""}`;

  return url;
}
