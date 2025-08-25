import { ProductFilters } from "../get-filters-from-search-params";

export function aiLabelsToFilters(ai: any): ProductFilters {
  const filters: Partial<ProductFilters> = {};

  if (Array.isArray(ai.brands) && ai.brands.length) filters.brands = ai.brands;
  if (Array.isArray(ai.categories) && ai.categories.length)
    filters.categories = ai.categories;
  if (Array.isArray(ai.colors) && ai.colors.length) filters.colors = ai.colors;
  if (Array.isArray(ai.sizes) && ai.sizes.length) filters.sizes = ai.sizes;
  if (Array.isArray(ai.genders) && ai.genders.length)
    filters.genders = ai.genders;

  if (typeof ai.price_min === "number") filters.priceMin = ai.price_min;
  if (typeof ai.price_max === "number") filters.priceMax = ai.price_max;

  return filters as ProductFilters;
}
