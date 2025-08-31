import { getProductDetails } from "@/lib/actions/get-product-details";

describe("getProductDetails", () => {
  const OLD_ENV = process.env;
  const normalize = (s: string) => s.replace(/\s+/g, "");

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

  it("calls fetch with the correct URL (includes query params) and returns the JSON (happy path)", async () => {
    const mockJson = { data: { id: "123", name: "Air Max", price: 100 } };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockJson),
    });

    const res = await getProductDetails("123");

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [calledUrl, calledOpts] = (global.fetch as jest.Mock).mock.calls[0];
    expect(calledOpts).toEqual({ cache: "no-store" });

    const urlStr = normalize(calledUrl);
    const expectedBase = normalize(
      `${process.env.NEXT_PUBLIC_API_URL}/products/123?`
    );
    expect(urlStr.startsWith(expectedBase)).toBe(true);

    const parsed = new URL(urlStr);
    expect(`${parsed.origin}${parsed.pathname}`).toBe(
      "https://fake-api.test/api/products/123"
    );

    const mustContain = [
      "fields[0]=name",
      "fields[1]=price",
      "fields[2]=description",
      "populate[color][fields][0]=name",
      "populate[sizes][fields][0]=value",
      "populate[images][fields][0]=url",
      "populate[gender][fields][0]=name",
    ];
    mustContain.forEach((frag) => {
      expect(urlStr).toEqual(expect.stringContaining(normalize(frag)));
    });

    expect(res).toEqual(mockJson);
  });

  it("returns { data: null } when response.json() resolves to null", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(null),
    });

    const res = await getProductDetails("456");
    expect(res).toEqual({ data: null });
  });

  it("when response.ok is false, logs the error and returns undefined", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn(),
    });

    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    const res = await getProductDetails("789");
    expect(res).toBeUndefined();

    expect(logSpy).toHaveBeenCalledTimes(1);
    const firstArg = logSpy.mock.calls[0][0];
    expect(firstArg).toBeInstanceOf(Error);
    expect((firstArg as Error).message).toBe("Failed to fetch product details");

    logSpy.mockRestore();
  });

  it("when fetch rejects (network error), logs and returns undefined", async () => {
    const err = new Error("network down");
    (global.fetch as jest.Mock).mockRejectedValue(err);

    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const res = await getProductDetails("999");

    expect(res).toBeUndefined();
    expect(logSpy).toHaveBeenCalledWith(err);

    logSpy.mockRestore();
  });
});
