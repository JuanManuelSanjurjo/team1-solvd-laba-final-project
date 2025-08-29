import { hasActiveFilters } from "@/lib/filter-utils";

describe("hasActiveFilters", () => {
  it("returns false when all filters are empty arrays", () => {
    const filters = {
      size: [],
      color: [],
      brand: [],
    };
    expect(hasActiveFilters(filters)).toBe(false);
  });

  it("returns false when all filters are falsy primitives", () => {
    const filters = {
      size: 0,
      color: "",
      onSale: false,
      available: null,
    };
    expect(hasActiveFilters(filters)).toBe(false);
  });

  it("returns true when at least one array filter is non-empty", () => {
    const filters = {
      size: [42],
      color: [],
      brand: [],
    };
    expect(hasActiveFilters(filters)).toBe(true);
  });

  it("returns true when at least one primitive filter is truthy", () => {
    const filters = {
      size: 0,
      color: "",
      onSale: true,
    };
    expect(hasActiveFilters(filters)).toBe(true);
  });

  it("returns true when a mix of empty and non-empty filters exist", () => {
    const filters = {
      size: [],
      color: "red",
      brand: [],
    };
    expect(hasActiveFilters(filters)).toBe(true);
  });

  it("returns false for completely empty object", () => {
    const filters = {};
    expect(hasActiveFilters(filters)).toBe(false);
  });
});
