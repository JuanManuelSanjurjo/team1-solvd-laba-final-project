import { fetchCategories } from "@/lib/actions/fetch-categories";

describe("fetchCategories", () => {
  beforeAll(() => {
    process.env.NEXT_PUBLIC_API_URL = "https://fake-api.test/api";
    global.fetch = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches categories and maps them to { label, value }", async () => {
    const mockJson = {
      data: [
        { id: 1, attributes: { name: "Shoes" } },
        { id: 2, attributes: { name: "Sneakers" } },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockJson),
    });

    const categories = await fetchCategories();

    expect(global.fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/categories`,
      { next: { revalidate: 3600 } }
    );

    expect(categories).toEqual([
      { label: "Shoes", value: 1 },
      { label: "Sneakers", value: 2 },
    ]);
  });

  it("throws an error if response is not ok", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn(),
    });

    await expect(fetchCategories()).rejects.toThrow(
      "Failed to fetch categories"
    );
  });

  it("handles empty data array", async () => {
    const mockJson = { data: [] };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockJson),
    });

    const categories = await fetchCategories();

    expect(categories).toEqual([]);
  });
});
