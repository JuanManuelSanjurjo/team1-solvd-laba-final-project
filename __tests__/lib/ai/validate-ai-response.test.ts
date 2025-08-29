import { validateAIResponse } from "@/lib/ai/validate-ai-response";

describe("validateAIResponse", () => {
  const options = {
    brands: [
      { label: "Nike", value: 1 },
      { label: "Adidas", value: 2 },
    ],
    colors: [
      { label: "Red", value: 1 },
      { label: "Blue", value: 2 },
    ],
    sizes: [
      { label: 42, value: 1 },
      { label: 43, value: 2 },
    ],
    categories: [
      { label: "Shoes", value: 1 },
      { label: "Running", value: 2 },
    ],
    genders: [
      { label: "Men", value: 1 },
      { label: "Women", value: 2 },
    ],
  };

  it("filters valid brands, colors, categories, sizes, and genders", () => {
    const aiResp = {
      brands: ["Nike", "Puma"],
      colors: ["Red", "Green"],
      categories: ["Shoes", "Casual"],
      sizes: [42, 44],
      genders: ["Men", "Kids"],
      price_min: 10,
      price_max: 100,
      searchTerm: " sneakers ",
      explain_short: "short desc",
    };

    const result = validateAIResponse(aiResp, options);

    expect(result).toEqual({
      brands: ["Nike"],
      colors: ["Red"],
      categories: ["Shoes"],
      sizes: [42],
      genders: ["Men"],
      price_min: 10,
      price_max: 100,
      searchTerm: "sneakers",
      explain_short: "short desc",
    });
  });

  it("handles empty or missing arrays", () => {
    const aiResp = {
      brands: [],
      colors: [],
      categories: [],
      sizes: [],
      genders: [],
      price_min: undefined,
      price_max: undefined,
      searchTerm: "",
      explain_short: "",
    };

    const result = validateAIResponse(aiResp, options);

    expect(result).toEqual({
      brands: [],
      colors: [],
      categories: [],
      sizes: [],
      genders: [],
      price_min: undefined,
      price_max: undefined,
      searchTerm: "",
      explain_short: "",
    });
  });

  it("trims searchTerm to max 200 characters", () => {
    const longTerm = "a".repeat(300);
    const aiResp = {
      brands: [],
      colors: [],
      categories: [],
      sizes: [],
      genders: [],
      price_min: undefined,
      price_max: undefined,
      searchTerm: longTerm,
      explain_short: "",
    };

    const result = validateAIResponse(aiResp, options);
    expect(result.searchTerm.length).toBe(200);
  });

  it("ignores invalid types in arrays", () => {
    const aiResp = {
      brands: ["Nike", 123 as unknown as string],
      colors: ["Red", null as unknown as string],
      categories: ["Shoes", {} as unknown as string],
      sizes: [42, "not a number" as unknown as number],
      genders: ["Men", false as unknown as string],
      price_min: 0,
      price_max: 100,
      searchTerm: "test",
      explain_short: "desc",
    };

    const result = validateAIResponse(aiResp, options);

    expect(result).toEqual({
      brands: ["Nike"],
      colors: ["Red"],
      categories: ["Shoes"],
      sizes: [42],
      genders: ["Men"],
      price_min: 0,
      price_max: 100,
      searchTerm: "test",
      explain_short: "desc",
    });
  });

  it("fills defaults for missing price_min, price_max, explain_short", () => {
    const aiResp = {
      brands: [],
      colors: [],
      categories: [],
      sizes: [],
      genders: [],
      price_min: undefined,
      price_max: undefined,
      searchTerm: "search",
      explain_short: null as unknown as string,
    };

    const result = validateAIResponse(aiResp, options);

    expect(result.price_min).toBeUndefined();
    expect(result.price_max).toBeUndefined();
    expect(result.explain_short).toBe("");
    expect(result.searchTerm).toBe("search");
  });
});
