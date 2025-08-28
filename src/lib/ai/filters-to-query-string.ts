import { ProductFilters } from "../get-filters-from-search-params";

/**
 * Converts a partial ProductFilters object into a query string suitable for navigation.
 *
 * Rules:
 *  - `searchTerm` maps to `searchTerm` query param (string).
 *  - `brands` -> repeated `brand` params.
 *  - `categories` -> repeated `categories` params.
 *  - `colors` -> repeated `color` params.
 *  - `sizes` -> repeated `size` params.
 *  - `genders` -> repeated `gender` params.
 *  - priceMin/priceMax are included only when both are numbers, priceMax > 0 and priceMax > priceMin.
 *
 * Returns the path `/?${qs}` if params exist or `/` when empty.
 *
 * @param {Partial<ProductFilters>} filters - The filters object to convert.
 * @returns {string} A URL path beginning with `/` and containing the querystring when applicable.
 *
 * @example
 * filtersToQueryString({ brands: ['Nike'], priceMin: 10, priceMax: 100 })
 * // -> "/?brand=Nike&priceMin=10&priceMax=100"
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

  if (
    typeof filters.priceMin === "number" &&
    typeof filters.priceMax === "number" &&
    filters.priceMax > 0 &&
    filters.priceMax > filters.priceMin
  ) {
    params.set("priceMin", String(filters.priceMin));
    params.set("priceMax", String(filters.priceMax));
  }

  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}
