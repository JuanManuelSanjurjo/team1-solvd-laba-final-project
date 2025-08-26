export type ProductFilters = {
  brands?: string[];
  sizes?: string[];
  genders?: string[];
  colors?: string[];
  categories?: string[];
  priceMin?: number;
  priceMax?: number;
  searchTerm?: string;
};

/**
 * Extracts and parses product filters from a `URLSearchParams` object.
 *
 * This function reads specific query parameters (`size`, `brand`, `gender`, `color`, `categories`,
 * `priceMin`, and `priceMax`) and converts them into a structured `ProductFilters` object.
 *
 * - Filters like `brand`, `size`, etc., are parsed as arrays using `getAll`.
 * - `priceMin` and `priceMax` are parsed as numbers if present.
 * - If a particular filter is not found or empty, it is set as `undefined` in the result.
 *
 * @param {URLSearchParams} searchParams - The URL search parameters
 * @returns {ProductFilters} - A normalized object containing filter values for use in product queries.
 */

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
  const searchTerm = searchParams.get("searchTerm");

  return {
    brands: brandFilters.length ? brandFilters : undefined,
    sizes: sizeFilters.length ? sizeFilters : undefined,
    genders: genderFilters.length ? genderFilters : undefined,
    colors: colorFilters.length ? colorFilters : undefined,
    categories: categoriesFilters.length ? categoriesFilters : undefined,

    priceMin: priceMin ? Number(priceMin) : undefined,
    priceMax: priceMax ? Number(priceMax) : undefined,
    searchTerm: searchTerm ? searchTerm : undefined,
  };
}
