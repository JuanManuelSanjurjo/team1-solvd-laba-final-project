import { getProductImages } from "@/lib/actions/get-product-images";
describe("getProductImages", () => {
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

  it("calls fetch with the correct URL and returns the images array (happy path)", async () => {
    const images = [
      { url: "https://cdn/img1.jpg", name: "img1" },
      { url: "https://cdn/img2.jpg", name: "img2" },
    ];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: { attributes: { images } },
      }),
    });

    const res = await getProductImages("123");

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [calledUrl, calledOpts] = (global.fetch as jest.Mock).mock.calls[0];
    expect(calledOpts).toEqual({ cache: "no-store" });

    const parsed = new URL(calledUrl);
    expect(`${parsed.origin}${parsed.pathname}`).toBe(
      "https://fake-api.test/api/products/123"
    );

    const qp = parsed.searchParams;
    expect(qp.get("populate[images][fields][0]")).toBe("url");
    expect(qp.get("populate[images][fields][1]")).toBe("name");

    expect(res).toEqual(images);
  });

  it("returns { data: null } when images path is missing", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: { attributes: {} },
      }),
    });

    const res = await getProductImages("456");
    expect(res).toEqual({ data: null });
  });

  it("returns [] when images is an empty array", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: { attributes: { images: [] } },
      }),
    });

    const res = await getProductImages("777");
    expect(res).toEqual([]);
  });

  it("returns { data: null } when responseData is null", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(null),
    });

    const res = await getProductImages("123");
    expect(res).toEqual({ data: null });
  });

  it("returns { data: null } when responseData.data is null", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ data: null }),
    });

    const res = await getProductImages("123");
    expect(res).toEqual({ data: null });
  });

  it("when response.ok is false, logs the error and returns undefined", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn(),
    });

    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const res = await getProductImages("789");

    expect(res).toBeUndefined();
    expect(logSpy).toHaveBeenCalledTimes(1);
    const firstArg = logSpy.mock.calls[0][0];
    expect(firstArg).toBeInstanceOf(Error);
    expect((firstArg as Error).message).toBe("Failed to fetch product images");

    logSpy.mockRestore();
  });

  it("when fetch rejects (network error), logs and returns undefined", async () => {
    const err = new Error("network down");
    (global.fetch as jest.Mock).mockRejectedValue(err);

    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const res = await getProductImages("999");

    expect(res).toBeUndefined();
    expect(logSpy).toHaveBeenCalledWith(err);

    logSpy.mockRestore();
  });
});
