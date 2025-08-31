import { createProduct } from "@/lib/actions/upload-product";

describe("createProduct", () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, NEXT_PUBLIC_API_URL: "https://api.test" };
    (global as any).fetch = jest.fn();
  });
  afterEach(() => {
    jest.restoreAllMocks();
    process.env = OLD_ENV;
  });

  it("posts payload to API with Authorization header", async () => {
    (global as any).fetch.mockResolvedValueOnce({ ok: true });

    const payload = { data: { name: "x" } } as any;
    const token = "tok-1";

    await expect(createProduct(payload, token)).resolves.toBeUndefined();

    expect((global as any).fetch).toHaveBeenCalledTimes(1);
    expect((global as any).fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/products`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );
  });

  it("throws if response not ok", async () => {
    (global as any).fetch.mockResolvedValueOnce({ ok: false });

    const payload = { data: { name: "x" } } as any;
    await expect(createProduct(payload, "t")).rejects.toThrow(
      "Product creation failed"
    );
  });
});
