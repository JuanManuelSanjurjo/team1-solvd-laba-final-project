import { deleteProduct } from "@/lib/actions/delete-product";

describe("deleteProduct", () => {
  const OLD_ENV = process.env;
  const API_URL = "https://api.example.test";

  beforeAll(() => {
    global.fetch = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV, NEXT_PUBLIC_API_URL: API_URL };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("calls fetch with correct URL, method and Authorization header", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

    await expect(deleteProduct(2660, "my-token")).resolves.toBeUndefined();

    expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/products/2660`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer my-token",
      },
    });
  });

  it("throws an error when response.ok is false", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false });

    await expect(deleteProduct(123, "bad-token")).rejects.toThrow(
      "Failed to delete product with ID 123"
    );
  });

  it("sends 'Bearer undefined' when token is undefined", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

    await deleteProduct(999, undefined as any);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: {
          Authorization: "Bearer undefined",
        },
      })
    );
  });
});
