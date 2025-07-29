export type ProductFilters = {
  brands?: string[];
  sizes?: string[];
  genders?: string[];
  colors?: string[];
  categories?: string[];
  priceMin?: number;
  priceMax?: number;
};

export async function fetchProducts(filters: ProductFilters) {
  const baseUrl = new URL(
    "https://shoes-shop-strapi.herokuapp.com/api/products"
  );
  baseUrl.searchParams.set("populate", "*");

  if (filters.brands) {
    filters.brands.forEach((brand, index) => {
      baseUrl.searchParams.append(`filters[brand][name][$in][${index}]`, brand);
    });
  }

  if (filters.sizes) {
    filters.sizes.forEach((size, index) => {
      baseUrl.searchParams.append(`filters[sizes][value][$in][${index}]`, size);
    });
  }

  if (filters.genders) {
    filters.genders.forEach((gender, index) => {
      baseUrl.searchParams.append(
        `filters[gender][name][$in][${index}]`,
        gender
      );
    });
  }

  if (filters.categories) {
    filters.categories.forEach((categorie, index) => {
      baseUrl.searchParams.append(
        `filters[categories][name][$in][${index}]`,
        categorie
      );
    });
  }

  if (filters.colors) {
    filters.colors.forEach((color, index) => {
      baseUrl.searchParams.append(`filters[color][name][$in][${index}]`, color);
    });
  }

  if (filters.priceMin !== undefined && filters.priceMax !== undefined) {
    baseUrl.searchParams.append(
      "filters[price][$between]",
      filters.priceMin.toString()
    );
    baseUrl.searchParams.append(
      "filters[price][$between]",
      filters.priceMax.toString()
    );
  }

  const response = await fetch(baseUrl.toString());
  if (!response.ok) throw new Error("Network response was not ok");
  const json = await response.json();
  return json.data;
}
