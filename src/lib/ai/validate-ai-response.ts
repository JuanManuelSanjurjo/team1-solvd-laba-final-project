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
