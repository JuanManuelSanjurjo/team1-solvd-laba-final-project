export function validateAIResponse(
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
    searchTerm,
  } = aiResp ?? {};

  const brandSet = new Set(options.brands.map((b) => b.label.toLowerCase()));
  const colorSet = new Set(options.colors.map((c) => c.label.toLowerCase()));
  const categorySet = new Set(
    options.categories.map((c) => c.label.toLowerCase())
  );
  const sizeSet = new Set(options.sizes.map((s) => s.label));
  const genderSet = new Set(options.genders.map((g) => g.label.toLowerCase()));

  const normalizedSearchTerm =
    typeof searchTerm === "string" && searchTerm.trim().length > 0
      ? searchTerm.trim().slice(0, 200)
      : "";

  return {
    brands: Array.isArray(brands)
      ? brands.filter((b: string) => brandSet.has(String(b).toLowerCase()))
      : [],
    colors: Array.isArray(colors)
      ? colors.filter((c: string) => colorSet.has(String(c).toLowerCase()))
      : [],
    categories: Array.isArray(categories)
      ? categories.filter((c: string) =>
          categorySet.has(String(c).toLowerCase())
        )
      : [],
    sizes: Array.isArray(sizes)
      ? sizes.filter((s: number) => sizeSet.has(s))
      : [],
    genders: Array.isArray(genders)
      ? genders.filter((g: string) => genderSet.has(String(g).toLowerCase()))
      : [],
    price_min: typeof price_min === "number" ? price_min : undefined,
    price_max: typeof price_max === "number" ? price_max : undefined,
    explain_short: typeof explain_short === "string" ? explain_short : "",
    searchTerm: normalizedSearchTerm,
  };
}
