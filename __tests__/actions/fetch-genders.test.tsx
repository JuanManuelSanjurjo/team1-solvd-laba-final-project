import { fetchGenders } from "@/lib/actions/fetch-genders";

describe("fetchGenders", () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("maps API response to {label, value}", async () => {
    const api = {
      data: [
        { id: 10, attributes: { name: "Women" } },
        { id: 11, attributes: { name: "Man" } },
      ],
    };
    (global as any).fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => api,
    });

    const result = await fetchGenders();
    expect(result).toEqual([
      { label: "Women", value: 10 },
      { label: "Man", value: 11 },
    ]);
  });

  it("throws if response not ok", async () => {
    (global as any).fetch.mockResolvedValueOnce({ ok: false });
    await expect(fetchGenders()).rejects.toThrow("Failed to fetch genders");
  });
});
