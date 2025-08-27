import { fetchSizes } from "@/lib/actions/fetch-sizes";

describe("fetchSizes", () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("maps API response to {label, value} array", async () => {
    const api = {
      data: [
        { id: 1, attributes: { value: 40 } },
        { id: 2, attributes: { value: 41 } },
      ],
    };
    (global as any).fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => api,
    });

    const result = await fetchSizes();
    expect(result).toEqual([
      { label: 40, value: 1 },
      { label: 41, value: 2 },
    ]);
    expect((global as any).fetch).toHaveBeenCalledWith(
      "https://shoes-shop-strapi.herokuapp.com/api/sizes",
      expect.objectContaining({ next: { revalidate: 3600 } })
    );
  });

  it("throws if response not ok", async () => {
    (global as any).fetch.mockResolvedValueOnce({ ok: false });
    await expect(fetchSizes()).rejects.toThrow("Failed to fetch sizes");
  });
});
