import { filtersToQueryString } from "@/lib/ai/filters-to-query-string";
import { ProductFilters } from "@/lib/get-filters-from-search-params";

describe("filtersToQueryString", () => {
  it("returns '/' if filters object is empty", () => {
    expect(filtersToQueryString({})).toBe("/");
  });

  it("includes searchTerm when provided", () => {
    const qs = filtersToQueryString({ searchTerm: "shoes" });
    expect(qs).toBe("/?searchTerm=shoes");
  });

  it("includes array filters correctly", () => {
    const filters: Partial<ProductFilters> = {
      brands: ["Nike", "Adidas"],
      categories: ["Sneakers"],
      colors: ["Black", "White"],
      sizes: ["42", "43"],
      genders: ["Men"],
    };
    const qs = filtersToQueryString(filters);
    const expectedParams = new URLSearchParams();
    expectedParams.append("brand", "Nike");
    expectedParams.append("brand", "Adidas");
    expectedParams.append("categories", "Sneakers");
    expectedParams.append("color", "Black");
    expectedParams.append("color", "White");
    expectedParams.append("size", "42");
    expectedParams.append("size", "43");
    expectedParams.append("gender", "Men");

    expect(qs).toBe("/?" + expectedParams.toString());
  });

  it("includes priceMin and priceMax when provided", () => {
    const filters: Partial<ProductFilters> = {
      priceMin: 100,
      priceMax: 500,
    };
    const qs = filtersToQueryString(filters);
    const expectedParams = new URLSearchParams();
    expectedParams.set("priceMin", "100");
    expectedParams.set("priceMax", "500");
    expect(qs).toBe("/?" + expectedParams.toString());
  });

  it("combines all filters correctly", () => {
    const filters: Partial<ProductFilters> = {
      searchTerm: "sneakers",
      brands: ["Nike"],
      categories: ["Running"],
      colors: ["Red"],
      sizes: ["42"],
      genders: ["Men"],
      priceMin: 50,
      priceMax: 200,
    };
    const qs = filtersToQueryString(filters);
    const expectedParams = new URLSearchParams();
    expectedParams.set("searchTerm", "sneakers");
    expectedParams.append("brand", "Nike");
    expectedParams.append("categories", "Running");
    expectedParams.append("color", "Red");
    expectedParams.append("size", "42");
    expectedParams.append("gender", "Men");
    expectedParams.set("priceMin", "50");
    expectedParams.set("priceMax", "200");

    expect(qs).toBe("/?" + expectedParams.toString());
  });

  it("ignores empty arrays or undefined values", () => {
    const filters: Partial<ProductFilters> = {
      brands: [],
      categories: [],
      colors: undefined,
      sizes: undefined,
      genders: [],
    };
    expect(filtersToQueryString(filters)).toBe("/");
  });
});
