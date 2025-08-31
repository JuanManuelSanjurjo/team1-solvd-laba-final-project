import { getFullProduct } from "@/lib/actions/get-full-product";

describe("getFullProduct", () => {
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

  it("calls fetch with the correct URL and returns the parsed JSON", async () => {
    const mockJson = { data: { id: 123, name: "Product 123" } };

    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockJson),
    });

    const res = await getFullProduct("123");

    expect(global.fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/products/123?populate=*`,
      { cache: "no-store" }
    );
    expect(res).toEqual(mockJson);
  });

  it("returns { data: null } when response.json() resolves to null", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(null),
    });

    const res = await getFullProduct("456");
    expect(res).toEqual({ data: null });
  });

  it("logs and returns undefined when fetch rejects (throws)", async () => {
    const err = new Error("network down");
    (global.fetch as jest.Mock).mockRejectedValue(err);

    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    const res = await getFullProduct("999");
    expect(res).toBeUndefined();
    expect(logSpy).toHaveBeenCalledWith(err);

    logSpy.mockRestore();
  });
});
