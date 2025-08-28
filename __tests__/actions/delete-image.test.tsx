import { deleteImage } from "@/lib/actions/delete-image";

describe("deleteImage", () => {
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

  it("deletes the image using DELETE and throws on failure", async () => {
    (global as any).fetch.mockResolvedValueOnce({ ok: true });
    await expect(deleteImage(5, "token")).resolves.toBeUndefined();

    expect((global as any).fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/upload/files/5`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer token`,
        },
      }
    );
  });

  it("throws when fetch returns not ok", async () => {
    (global as any).fetch.mockResolvedValueOnce({ ok: false });
    await expect(deleteImage(123, "t")).rejects.toThrow(
      "Failed to delete image with ID 123"
    );
  });
});
