import {
  getFiltersFromSearchParams,
  type ProductFilters,
} from "@/lib/get-filters-from-search-params";

describe("getFiltersFromSearchParams", () => {
  it("returns undefined for all filters if URLSearchParams is empty", () => {
    const searchParams = new URLSearchParams("");
    const filters: ProductFilters = getFiltersFromSearchParams(searchParams);

    expect(filters).toEqual({
      brands: undefined,
      sizes: undefined,
      genders: undefined,
      colors: undefined,
      categories: undefined,
      priceMin: undefined,
      priceMax: undefined,
      searchTerm: undefined,
    });
  });

  it("parses array filters correctly", () => {
    const searchParams = new URLSearchParams();
    searchParams.append("size", "42");
    searchParams.append("size", "43");
    searchParams.append("brand", "Nike");
    searchParams.append("brand", "Adidas");

    const filters = getFiltersFromSearchParams(searchParams);

    expect(filters.sizes).toEqual(["42", "43"]);
    expect(filters.brands).toEqual(["Nike", "Adidas"]);
  });

  it("parses number filters correctly", () => {
    const searchParams = new URLSearchParams();
    searchParams.set("priceMin", "100");
    searchParams.set("priceMax", "500");

    const filters = getFiltersFromSearchParams(searchParams);

    expect(filters.priceMin).toBe(100);
    expect(filters.priceMax).toBe(500);
  });

  it("parses searchTerm correctly", () => {
    const searchParams = new URLSearchParams();
    searchParams.set("searchTerm", "shoes");

    const filters = getFiltersFromSearchParams(searchParams);

    expect(filters.searchTerm).toBe("shoes");
  });

  it("returns undefined for empty array filters", () => {
    const searchParams = new URLSearchParams();
    searchParams.append("size", "");
    searchParams.append("brand", "");

    const filters = getFiltersFromSearchParams(searchParams);

    expect(filters.sizes).toEqual([""]);
    expect(filters.brands).toEqual([""]);
  });

  it("mix of array, number, and string filters", () => {
    const searchParams = new URLSearchParams();
    searchParams.append("size", "42");
    searchParams.append("brand", "Nike");
    searchParams.set("priceMin", "50");
    searchParams.set("searchTerm", "sneakers");

    const filters = getFiltersFromSearchParams(searchParams);

    expect(filters).toEqual({
      sizes: ["42"],
      brands: ["Nike"],
      genders: undefined,
      colors: undefined,
      categories: undefined,
      priceMin: 50,
      priceMax: undefined,
      searchTerm: "sneakers",
    });
  });
});
