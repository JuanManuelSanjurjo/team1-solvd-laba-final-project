import { ProductFilters } from "./getFiltersFromSearchParams";

/**
 * Determines whether any filters are currently active.
 *
 * A filter is considered active if:
 * - Its value is a non-empty array.
 * - Its value is a truthy primitive (e.g., non-empty string, number, boolean `true`, etc.).
 *
 * @param {ProductFilters} filters - An object representing filter values where keys are filter names.
 * @returns {boolean} - Returns `true` if at least one filter is active, otherwise `false`.
 */

export const hasActiveFilters = (filters: ProductFilters): boolean => {
  return Object.values(filters).some((value) =>
    Array.isArray(value) ? value.length > 0 : !!value
  );
};
