/**
 * Parsed shape expected from the AI filter-generation endpoint.
 * This is not exported (local usage), but documents the fields used by the validator.
 *
 * @interface AiResponseParsed
 * @property {string[]} brands - Suggested brand labels from AI.
 * @property {string[]} categories - Suggested category labels from AI.
 * @property {number | undefined} price_min - Suggested minimum price.
 * @property {number | undefined} price_max - Suggested maximum price.
 * @property {string[]} colors - Suggested color labels from AI.
 * @property {string[]} genders - Suggested gender labels from AI.
 * @property {number[]} sizes - Suggested numeric sizes from AI.
 * @property {string} [searchTerm] - Optional free-text search term detected by AI.
 * @property {string} [explain_short] - Optional short explanation from AI.
 */
interface AiResponseParsed {
  brands: string[];
  categories: string[];
  price_min: number | undefined;
  price_max: number | undefined;
  colors: string[];
  genders: string[];
  sizes: number[];
  searchTerm?: string;
  explain_short?: string;
}

/**
 * Validates and sanitizes the AI response against the current platform options.
 *
 * The function:
 *  - filters brand/category/color/gender/size arrays to keep only labels that exist
 *    in `options` (case-insensitive for labels; sizes compare on option.label),
 *  - ensures price_min/price_max are numbers or undefined,
 *  - clamps the `searchTerm` to a trimmed string of max 200 chars or empty string,
 *  - returns the cleaned object ready to be converted into your UI filters.
 *
 * Note: this function does not mutate `options`.
 *
 * @param {AiResponseParsed | undefined | null} aiResp - Raw AI parsed response to validate.
 * @param {object} options - The available options in the UI to validate against.
 * @param {{label: string; value: number}[]} options.brands - Available brand labels.
 * @param {{label: string; value: number}[]} options.colors - Available color labels.
 * @param {{label: number; value: number}[]} options.sizes - Available size options (label is numeric).
 * @param {{label: string; value: number}[]} options.categories - Available category labels.
 * @param {{label: string; value: number}[]} options.genders - Available gender labels.
 *
 * @returns {object} Sanitized object with keys:
 *  - brands: string[],
 *  - colors: string[],
 *  - categories: string[],
 *  - sizes: number[],
 *  - genders: string[],
 *  - price_min?: number,
 *  - price_max?: number,
 *  - explain_short: string,
 *  - searchTerm: string
 *
 * @example
 * const result = validateAIResponse(aiResp, {
 *   brands: [{label: 'Nike', value: 1}],
 *   colors: [{label: 'Red', value: 1}],
 *   sizes: [{label: 42, value: 1}],
 *   categories: [{label: 'Running', value: 1}],
 *   genders: [{label: 'Men', value: 1}],
 * });
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
