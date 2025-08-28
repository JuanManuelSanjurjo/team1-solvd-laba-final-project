const API_BASE = "https://example.test/api";

function buildExpectedUrl(base: string, ids: number[]): string {
  const qs = new URLSearchParams();
  qs.append("fields[0]", "id");
  ids.forEach((id, idx) => {
    qs.append(`filters[id][$in][${idx}]`, String(id));
  });
  qs.append("pagination[pageSize]", String(ids.length));
  qs.append("pagination[withCount]", "false");
  return `${base}/products?${qs.toString()}`;
}

describe("fetchActiveProductsIds", () => {
  let originalFetch: typeof fetch | undefined;
  let fetchMock: jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = API_BASE;

    originalFetch = global.fetch;

    fetchMock = jest.fn() as unknown as jest.MockedFunction<typeof fetch>;

    (global as any).fetch = fetchMock;
  });

  afterEach(() => {
    if (originalFetch) {
      (global as any).fetch = originalFetch;
    } else {
      delete (global as any).fetch;
    }

    jest.clearAllMocks();
    jest.resetModules();
  });

  it("returns [] and does not call fetch when ids is empty", async () => {
    const { fetchActiveProductsIds } = await import(
      "@/lib/actions/fetch-active-products-ids"
    );

    const result = await fetchActiveProductsIds([]);
    expect(result).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fetches once and preserves input order in the output", async () => {
    const { fetchActiveProductsIds } = await import(
      "@/lib/actions/fetch-active-products-ids"
    );

    const ids = [1, 2, 3];
    const expectedUrl = buildExpectedUrl(API_BASE, ids);

    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: [{ id: 3 }, { id: 1 }] }),
    } as unknown as Response);

    const out = await fetchActiveProductsIds(ids);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(expectedUrl, { cache: "no-store" });
    expect(out).toEqual([1, 3]);
  });

  it("handles fetch rejection: logs error and returns empty array", async () => {
    const { fetchActiveProductsIds } = await import(
      "@/lib/actions/fetch-active-products-ids"
    );

    const ids = [10, 20, 30];

    fetchMock.mockRejectedValueOnce(new Error("network down"));

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const result = await fetchActiveProductsIds(ids);

    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("logs error and returns [] when response is non-ok (covers throw line)", async () => {
    const { fetchActiveProductsIds } = await import(
      "@/lib/actions/fetch-active-products-ids"
    );

    const ids = [7, 8, 9];
    const expectedUrl = buildExpectedUrl(API_BASE, ids);

    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as unknown as Response);

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const out = await fetchActiveProductsIds(ids);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(expectedUrl, { cache: "no-store" });

    expect(out).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching product ids:",
      expect.any(Error)
    );

    const errObj = (consoleSpy.mock.calls[0] ?? [])[1] as Error;
    expect(String(errObj?.message)).toContain("500");

    consoleSpy.mockRestore();
  });

  it("includes cache:'no-store' in each request", async () => {
    const { fetchActiveProductsIds } = await import(
      "@/lib/actions/fetch-active-products-ids"
    );

    const ids = [5, 6];

    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: [{ id: 5 }, { id: 6 }] }),
    } as unknown as Response);

    await fetchActiveProductsIds(ids);

    const [, options] = fetchMock.mock.calls[0];
    expect((options as RequestInit).cache).toBe("no-store");
  });

  it("adds ids from API (string -> number) so forEach callback runs", async () => {
    const { fetchActiveProductsIds } = await import(
      "@/lib/actions/fetch-active-products-ids"
    );

    const ids = [42];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: [{ id: "42" }] }),
    } as unknown as Response);

    const out = await fetchActiveProductsIds(ids);

    expect(out).toEqual([42]);
  });

  it("handles missing data property (coalesces to empty array)", async () => {
    const { fetchActiveProductsIds } = await import(
      "@/lib/actions/fetch-active-products-ids"
    );

    const ids = [1, 2];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
    } as unknown as Response);

    const out = await fetchActiveProductsIds(ids);

    expect(out).toEqual([]);
  });
});
