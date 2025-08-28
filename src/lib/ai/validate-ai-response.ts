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

/**
 * @function
 * @param {AiResponseParsed} aiResp - The AI response to validate.
 * @param {Object} options - The options to use for validation.
 * @param {Object[]} options.brands - The brands to validate against.
 * @param {string} options.brands[].label - The label of the brand.
 * @param {number} options.brands[].value - The value of the brand.
 * @param {Object[]} options.colors - The colors to validate against.
 * @param {string} options.colors[].label - The label of the color.
 * @param {number} options.colors[].value - The value of the color.
 * @param {Object[]} options.sizes - The sizes to validate against.
 * @param {number} options.sizes[].label - The label of the size.
 * @param {number} options.sizes[].value - The value of the size.
 * @param {Object[]} options.categories - The categories to validate against.
 * @param {string} options.categories[].label - The label of the category.
 * @param {number} options.categories[].value - The value of the category.
 * @param {Object[]} options.genders - The genders to validate against.
 * @param {string} options.genders[].label - The label of the gender.
 * @param {number} options.genders[].value - The value of the gender.
 * @returns {AiResponseParsed} - The validated AI response.
 *
 * @example
 * const validatedResp = validateAIResponse(aiResp, {
 *   brands: [{ label: "Brand 1", value: 1 }],
 *   colors: [{ label: "Red", value: 1 }],
 *   sizes: [{ label: 10, value: 1 }],
 *   categories: [{ label: "Category 1", value: 1 }],
 *   genders: [{ label: "Male", value: 1 }],
 * });
 * console.log(validatedResp); // Output: { brands: ["Brand 1"], colors: ["Red"], sizes: [10], categories: ["Category 1"], genders: ["Male"], price_min: 100, price_max: 200, explain_short: "Red shoes", searchTerm: "red shoes" }
 */
export function validateAIResponse(
  aiResp: AiResponseParsed,
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
