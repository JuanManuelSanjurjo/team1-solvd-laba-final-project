import { ProductFilters } from "../get-filters-from-search-params";

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

function validateAIResponse(
  aiResp: any,
  options: {
    brands: { label: string; value: number }[];
    colors: { label: string; value: number }[];
    sizes: { label: number; value: number }[];
    categories: { label: string; value: number }[];
    genders: { label: string; value: number }[];
  }
) {
  const {
    brands = [],
    categories = [],
    colors = [],
    sizes = [],
    genders = [],
    price_min,
    price_max,
    explain_short,
  } = aiResp;

  const brandSet = new Set(options.brands.map((b) => b.label.toLowerCase()));
  const colorSet = new Set(options.colors.map((c) => c.label.toLowerCase()));
  const categorySet = new Set(
    options.categories.map((c) => c.label.toLowerCase())
  );
  const sizeSet = new Set(options.sizes.map((s) => s.label));
  const genderSet = new Set(options.genders.map((g) => g.label.toLowerCase()));

  return {
    brands: brands.filter((b: string) => brandSet.has(b.toLowerCase())),
    colors: colors.filter((c: string) => colorSet.has(c.toLowerCase())),
    categories: categories.filter((c: string) =>
      categorySet.has(c.toLowerCase())
    ),
    sizes: sizes.filter((s: number) => sizeSet.has(s)),
    genders: genders.filter((g: string) =>
      genderSet.has(g.toLocaleLowerCase())
    ),
    price_min,
    price_max,
    explain_short,
  };
}
