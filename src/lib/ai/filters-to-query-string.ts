import { ProductFilters } from "../get-filters-from-search-params";

/**
 * @function
 * @param {Partial<ProductFilters>} filters - The filters object.
 * @returns {string} - The query string.
 *
 * @example
 * const queryString = filtersToQueryString({
 *   searchTerm: "Search Term",
 *   brands: ["Brand1", "Brand2"],
 *   categories: ["Category1", "Category2"],
 *   colors: ["Red", "Blue"],
 *   sizes: [40, 42],
 *   genders: ["Men", "Women"],
 *   priceMin: 100,
 *   priceMax: 200,
 * });
 */
export function filtersToQueryString(filters: Partial<ProductFilters>) {
  const params = new URLSearchParams();

  if (typeof filters.searchTerm === "string" && filters.searchTerm.length > 0) {
    params.set("searchTerm", filters.searchTerm);
  }

  if (Array.isArray(filters.brands) && filters.brands.length) {
    filters.brands.forEach((b) => params.append("brand", String(b)));
  }
  if (Array.isArray(filters.categories) && filters.categories.length) {
    filters.categories.forEach((c) => params.append("categories", String(c)));
  }
  if (Array.isArray(filters.colors) && filters.colors.length) {
    filters.colors.forEach((c) => params.append("color", String(c)));
  }
  if (Array.isArray(filters.sizes) && filters.sizes.length) {
    filters.sizes.forEach((s) => params.append("size", String(s)));
  }
  if (Array.isArray(filters.genders) && filters.genders.length) {
    filters.genders.forEach((s) => params.append("gender", String(s)));
  }

  if (typeof filters.priceMin === "number") {
    params.set("priceMin", String(filters.priceMin));
  }
  if (typeof filters.priceMax === "number") {
    params.set("priceMax", String(filters.priceMax));
  }

  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}
