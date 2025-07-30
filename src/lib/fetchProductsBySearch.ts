export const fetchProductsBySearch = async (
  query: string,
  searchFields: string[] = ["name"],
  populateFields: string[] = []
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
