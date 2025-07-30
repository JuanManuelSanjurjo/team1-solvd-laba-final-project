export const hasActiveFilters = (filters: Record<string, any>): boolean => {
  return Object.values(filters).some((value) =>
    Array.isArray(value) ? value.length > 0 : !!value
  );
};
