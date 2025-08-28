import { ProductFilters } from "../get-filters-from-search-params";

interface AiResponseParsed {
  brands: string[];
  categories: string[];
  price_min: number | undefined;
  price_max: number | undefined;
  colors: string[];
  genders: string[];
  sizes: number[];
  searchTerm: string;
  explain_short: string;
}

export function aiLabelsToFilters(ai: AiResponseParsed): ProductFilters {
  const filters: Partial<ProductFilters> = {};

  if (Array.isArray(ai.brands) && ai.brands.length) filters.brands = ai.brands;
  if (Array.isArray(ai.categories) && ai.categories.length)
    filters.categories = ai.categories;
  if (Array.isArray(ai.colors) && ai.colors.length) filters.colors = ai.colors;
  if (Array.isArray(ai.sizes) && ai.sizes.length)
    filters.sizes = ai.sizes.map((size) => String(size));
  if (Array.isArray(ai.genders) && ai.genders.length)
    filters.genders = ai.genders;

  if (typeof ai.price_min === "number") filters.priceMin = ai.price_min;
  if (typeof ai.price_max === "number") filters.priceMax = ai.price_max;

  if (typeof ai.searchTerm === "string" && ai.searchTerm.trim().length > 0) {
    filters.searchTerm = ai.searchTerm.trim();
  }

  return filters as ProductFilters;
}
