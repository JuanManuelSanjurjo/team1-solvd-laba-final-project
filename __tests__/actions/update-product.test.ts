import { updateProduct } from "@/lib/actions/update-product";

describe("updateProduct", () => {
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

  it("sends PUT to correct url with token and body", async () => {
    (global as any).fetch.mockResolvedValueOnce({ ok: true });

    const productId = 42;
    const payload = { data: { name: "New" } } as any;
    const token = "abc";

    await expect(
      updateProduct(productId, payload, token)
    ).resolves.toBeUndefined();

    expect((global as any).fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );
  });

  it("throws error message from response on failure", async () => {
    const errObj = { message: "oops" };
    (global as any).fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => errObj,
    });

    await expect(updateProduct(1, { data: {} } as any, "t")).rejects.toThrow(
      "oops"
    );
  });
});
