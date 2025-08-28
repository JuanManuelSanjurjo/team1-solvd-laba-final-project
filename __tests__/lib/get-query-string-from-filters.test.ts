import { getQueryStringFromFilters } from "@/lib/get-query-string-from-filters";

describe("getQueryStringFromFilters", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_API_URL: "https://api.example.com",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns URL with default searchFields when not provided", () => {
    const url = getQueryStringFromFilters("shoes");
    expect(url).toBe(
      "https://api.example.com/products?filters[$or][0][name][$containsi]=shoes&filters[teamName][$in]=team-1",
    );
  });

  it("encodes special characters in query", () => {
    const url = getQueryStringFromFilters("red shoes & boots");
    expect(url).toContain("red%20shoes%20%26%20boots");
  });

  it("handles nested searchFields", () => {
    const url = getQueryStringFromFilters("sneakers", [
      "name",
      "color.name",
      "brand.name",
    ]);
    expect(url).toContain("filters[$or][0][name][$containsi]=sneakers");
    expect(url).toContain("filters[$or][1][color][name][$containsi]=sneakers");
    expect(url).toContain("filters[$or][2][brand][name][$containsi]=sneakers");
  });

  it("adds populate fields if provided", () => {
    const url = getQueryStringFromFilters(
      "sneakers",
      ["name"],
      ["color.name", "brand.name"],
    );
    expect(url).toContain("populate[color][fields][0]=name");
    expect(url).toContain("populate[brand][fields][0]=name");
  });

  it("ignores populate fields if 'all' is included", () => {
    const url = getQueryStringFromFilters(
      "sneakers",
      ["name"],
      ["all", "color.name"],
    );
    expect(url).not.toContain("populate[color][fields][0]=name");
    expect(url).toContain("filters[$or][0][name][$containsi]=sneakers");
  });

  it("returns full URL with filters and populate combined", () => {
    const url = getQueryStringFromFilters(
      "hat",
      ["name", "categories.name"],
      ["categories.name"],
    );
    expect(url).toBe(
      "https://api.example.com/products?filters[$or][0][name][$containsi]=hat&filters[$or][1][categories][name][$containsi]=hat&filters[teamName][$in]=team-1&populate[categories][fields][0]=name",
    );
  });
});
