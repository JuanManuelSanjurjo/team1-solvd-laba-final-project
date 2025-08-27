import { fetchBrands } from "@/lib/actions/fetch-brands";

describe("fetchBrands", () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("maps API response to {label, value}", async () => {
    const api = {
      data: [
        { id: 7, attributes: { name: "ACME" } },
        { id: 8, attributes: { name: "Other" } },
      ],
    };
    (global as any).fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => api,
    });

    const result = await fetchBrands();
    expect(result).toEqual([
      { label: "ACME", value: 7 },
      { label: "Other", value: 8 },
    ]);
  });

  it("throws if response not ok", async () => {
    (global as any).fetch.mockResolvedValueOnce({ ok: false });
    await expect(fetchBrands()).rejects.toThrow("Failed to fetch brands");
  });
});
