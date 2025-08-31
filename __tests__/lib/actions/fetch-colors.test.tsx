import { fetchColors } from "@/lib/actions/fetch-colors";

describe("fetchColors", () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("maps API response to {label, value}", async () => {
    const api = {
      data: [
        { id: 3, attributes: { name: "Red" } },
        { id: 4, attributes: { name: "Blue" } },
      ],
    };
    (global as any).fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => api,
    });

    const result = await fetchColors();
    expect(result).toEqual([
      { label: "Red", value: 3 },
      { label: "Blue", value: 4 },
    ]);
  });

  it("throws if response not ok", async () => {
    (global as any).fetch.mockResolvedValueOnce({ ok: false });
    await expect(fetchColors()).rejects.toThrow("Failed to fetch colors");
  });
});
