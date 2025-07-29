export type ProductFilters = {
  brands?: string[];
  sizes?: string[];
  genders?: string[];
  colors?: string[];
  categories?: string[];
  priceMin?: number;
  priceMax?: number;
};

export function getFiltersFromSearchParams(
  searchParams: URLSearchParams
): ProductFilters {
  const sizeFilters = searchParams.getAll("size");
  const brandFilters = searchParams.getAll("brand");
  const genderFilters = searchParams.getAll("gender");
  const colorFilters = searchParams.getAll("color");
  const categoriesFilters = searchParams.getAll("categories");
  const priceMin = searchParams.get("priceMin");
  const priceMax = searchParams.get("priceMax");

  return {
    brands: brandFilters.length ? brandFilters : undefined,
    sizes: sizeFilters.length ? sizeFilters : undefined,
    genders: genderFilters.length ? genderFilters : undefined,
    colors: colorFilters.length ? colorFilters : undefined,
    categories: categoriesFilters.length ? categoriesFilters : undefined,

    priceMin: priceMin ? Number(priceMin) : undefined,
    priceMax: priceMax ? Number(priceMax) : undefined,
  };
}
