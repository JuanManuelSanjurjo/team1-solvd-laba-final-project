import { fetchProducts } from "@/lib/actions/fetch-products";
import { getQueryStringFromFilters } from "@/lib/get-query-string-from-filters";

jest.mock("@/lib/get-query-string-from-filters", () => ({
  getQueryStringFromFilters: jest.fn(),
}));

describe("fetchProducts", () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    process.env = {
      ...OLD_ENV,
      NEXT_PUBLIC_API_URL: "https://fake-api.test/api",
    };
    global.fetch = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("builds URL with all filters, adds Authorization when user present, and returns JSON (happy path)", async () => {
    const filters = {
      brands: ["Nike", "Adidas"],
      sizes: ["42", "43"],
      genders: ["Men", "Women"],
      categories: ["Running", "Lifestyle"],
      colors: ["Red", "Blue"],
      priceMin: 100,
      priceMax: 300,
      user: { userId: "user-123", token: "jwt-abc" },
    };

    const pageNumber = 2;
    const pageSize = 12;

    const mockJson = { data: [{ id: 1 }] };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockJson),
    });

    const out = await fetchProducts(filters as any, pageNumber, pageSize, null);

    const expected = new URL(`${process.env.NEXT_PUBLIC_API_URL}/products`);
    expected.searchParams.set("populate", "*");
    expected.searchParams.set("pagination[page]", String(pageNumber));
    expected.searchParams.set("pagination[pageSize]", String(pageSize));

    filters.brands!.forEach((b, i) =>
      expected.searchParams.append(`filters[brand][name][$in][${i}]`, b)
    );
    filters.sizes!.forEach((s, i) =>
      expected.searchParams.append(`filters[sizes][value][$in][${i}]`, s)
    );
    filters.genders!.forEach((g, i) =>
      expected.searchParams.append(`filters[gender][name][$in][${i}]`, g)
    );
    filters.categories!.forEach((c, i) =>
      expected.searchParams.append(`filters[categories][name][$in][${i}]`, c)
    );
    filters.colors!.forEach((c, i) =>
      expected.searchParams.append(`filters[color][name][$in][${i}]`, c)
    );
    expected.searchParams.append("filters[price][$between]", "100");
    expected.searchParams.append("filters[price][$between]", "300");
    expected.searchParams.append("filters[teamName][$in]", "team-1");
    expected.searchParams.append("filters[userID][id][$eq]", "user-123");

    expect(global.fetch).toHaveBeenCalledWith(expected.toString(), {
      headers: { Authorization: "Bearer jwt-abc" },
    });
    expect(out).toEqual(mockJson);
  });

  it("builds URL with only base parameters when no filters are provided", async () => {
    const filters = {};
    const pageNumber = 1;
    const pageSize = 10;

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ data: [] }),
    });

    await fetchProducts(filters as any, pageNumber, pageSize, null);

    const expected = new URL(`${process.env.NEXT_PUBLIC_API_URL}/products`);
    expected.searchParams.set("populate", "*");
    expected.searchParams.set("pagination[page]", String(pageNumber));
    expected.searchParams.set("pagination[pageSize]", String(pageSize));
    expected.searchParams.append("filters[teamName][$in]", "team-1");

    expect(global.fetch).toHaveBeenCalledWith(expected.toString(), {
      headers: {},
    });
  });

  it("when searchTerm is provided, uses getQueryStringFromFilters and still sets pagination, populate, teamName", async () => {
    const searchTerm = "air";
    const searchFields = ["name", "description"];
    const populateFields = ["images"];

    const seedUrl = "https://seed.test/api/products?foo=bar";
    (getQueryStringFromFilters as jest.Mock).mockReturnValue(seedUrl);

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ data: [] }),
    });

    const filters = { brands: ["Nike"] };
    await fetchProducts(
      filters as any,
      1,
      24,
      searchTerm,
      searchFields,
      populateFields
    );

    expect(getQueryStringFromFilters).toHaveBeenCalledWith(
      searchTerm,
      searchFields,
      populateFields
    );

    const expected = new URL(seedUrl);
    expected.searchParams.set("populate", "*");
    expected.searchParams.set("pagination[page]", "1");
    expected.searchParams.set("pagination[pageSize]", "24");
    expected.searchParams.append(`filters[brand][name][$in][0]`, "Nike");
    expected.searchParams.append("filters[teamName][$in]", "team-1");

    expect(global.fetch).toHaveBeenCalledWith(expected.toString(), {
      headers: {},
    });
  });

  it("does not append price[$between] when only one bound is provided", async () => {
    const filters = {
      priceMin: 50,
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ data: [] }),
    });

    await fetchProducts(filters as any, 1, 10, null);

    const calledUrl = new URL((global.fetch as jest.Mock).mock.calls[0][0]);

    const betweenParams = calledUrl.searchParams.getAll(
      "filters[price][$between]"
    );
    expect(betweenParams).toHaveLength(0);
    expect(calledUrl.searchParams.get("populate")).toBe("*");
    expect(calledUrl.searchParams.get("pagination[page]")).toBe("1");
    expect(calledUrl.searchParams.get("pagination[pageSize]")).toBe("10");
    expect(calledUrl.searchParams.getAll("filters[teamName][$in]")).toEqual([
      "team-1",
    ]);
  });

  it("throws when response.ok is false", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn(),
    });

    await expect(fetchProducts({} as any, 1, 10, null)).rejects.toThrow(
      "Network response was not ok"
    );
  });
});
