import { getProductName } from "@/lib/actions/get-product-name";

describe("getProductName", () => {
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

  it("calls fetch with the correct URL and returns the parsed JSON (happy path)", async () => {
    const mockJson = { data: { id: "123", attributes: { name: "Air Max" } } };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockJson),
    });

    const res = await getProductName("123");

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/products/123?fields=name`,
      { cache: "no-store" }
    );
    expect(res).toEqual(mockJson);
  });

  it("returns { data: null } when response.json() resolves to null", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(null),
    });

    const res = await getProductName("456");
    expect(res).toEqual({ data: null });
  });

  it("when response.ok is false, logs the error and returns undefined", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn(),
    });

    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const res = await getProductName("789");

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
    const res = await getProductName("999");

    expect(res).toBeUndefined();
    expect(logSpy).toHaveBeenCalledWith(err);

    logSpy.mockRestore();
  });
});
