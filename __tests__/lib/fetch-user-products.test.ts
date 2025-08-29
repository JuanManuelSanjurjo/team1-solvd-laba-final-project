import { fetchUserProducts } from "@/lib/actions/fetch-user-products";

describe("fetchUserProducts", () => {
  const userId = 1;
  const token = "mock-token";

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should fetch products and return data on success", async () => {
    const mockProducts = [{ id: 1, name: "Product 1" }];
    const mockJson = { products: mockProducts };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockJson),
    } as any);

    const result = await fetchUserProducts(userId, token);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(
        `/users/${userId}?populate[products][populate]=*`,
      ),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${token}`,
        }),
      }),
    );

    expect(result).toEqual(mockProducts);
  });

  it("should throw an error when response is not ok", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest.fn(),
    } as any);

    await expect(fetchUserProducts(userId, token)).rejects.toThrow(
      "Network response was not ok",
    );
  });

  it("should throw if fetch itself fails", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Fetch failed"));

    await expect(fetchUserProducts(userId, token)).rejects.toThrow(
      "Fetch failed",
    );
  });
});
