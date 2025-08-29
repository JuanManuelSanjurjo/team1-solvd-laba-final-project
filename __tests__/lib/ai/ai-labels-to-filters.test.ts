import { aiLabelsToFilters } from "@/lib/ai/ai-labels-to-filters";
import { ProductFilters } from "@/lib/get-filters-from-search-params";

describe("aiLabelsToFilters", () => {
  it("converts full AI response to ProductFilters", () => {
    const aiResponse = {
      brands: ["Nike", "Adidas"],
      categories: ["Shoes", "Sneakers"],
      colors: ["Red", "Black"],
      sizes: [42, 43],
      genders: ["Men"],
      price_min: 50,
      price_max: 200,
      searchTerm: "running shoes",
      explain_short: "AI explanation",
    };

    const filters: ProductFilters = aiLabelsToFilters(aiResponse);

    expect(filters).toEqual({
      brands: ["Nike", "Adidas"],
      categories: ["Shoes", "Sneakers"],
      colors: ["Red", "Black"],
      sizes: ["42", "43"],
      genders: ["Men"],
      priceMin: 50,
      priceMax: 200,
      searchTerm: "running shoes",
    });
  });

  it("ignores empty arrays and undefined values", () => {
    const aiResponse = {
      brands: [],
      categories: [],
      colors: [],
      sizes: [],
      genders: [],
      price_min: undefined,
      price_max: undefined,
      searchTerm: "",
      explain_short: "AI explanation",
    };

    const filters: ProductFilters = aiLabelsToFilters(aiResponse);

    expect(filters).toEqual({});
  });

  it("trims searchTerm and includes it if not empty", () => {
    const aiResponse = {
      brands: [],
      categories: [],
      colors: [],
      sizes: [],
      genders: [],
      price_min: undefined,
      price_max: undefined,
      searchTerm: "   sneakers   ",
      explain_short: "AI explanation",
    };

    const filters: ProductFilters = aiLabelsToFilters(aiResponse);

    expect(filters).toEqual({
      searchTerm: "sneakers",
    });
  });

  it("converts numeric sizes to string array", () => {
    const aiResponse = {
      brands: [],
      categories: [],
      colors: [],
      sizes: [38, 40, 42],
      genders: [],
      price_min: undefined,
      price_max: undefined,
      searchTerm: "",
      explain_short: "AI explanation",
    };

    const filters: ProductFilters = aiLabelsToFilters(aiResponse);

    expect(filters.sizes).toEqual(["38", "40", "42"]);
  });

  it("includes only valid number priceMin and priceMax", () => {
    const aiResponse = {
      brands: [],
      categories: [],
      colors: [],
      sizes: [],
      genders: [],
      price_min: 100,
      price_max: 500,
      searchTerm: "",
      explain_short: "AI explanation",
    };

    const filters: ProductFilters = aiLabelsToFilters(aiResponse);

    expect(filters.priceMin).toBe(100);
    expect(filters.priceMax).toBe(500);
  });
});
