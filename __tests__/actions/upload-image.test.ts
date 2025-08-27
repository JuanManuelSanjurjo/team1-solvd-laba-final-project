import { uploadImages } from "@/lib/actions/upload-images";

describe("uploadImages", () => {
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

  it("uploads files and returns array of ids", async () => {
    const responseBody = [{ id: 100 }, { id: 101 }];
    (global as any).fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => responseBody,
    });

    // create File(s) (jsdom environment supports File)
    const files = [new File(["a"], "a.png", { type: "image/png" })];

    const ids = await uploadImages(files);

    expect(ids).toEqual([100, 101]);
    expect((global as any).fetch).toHaveBeenCalledTimes(1);
    expect((global as any).fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/upload`,
      expect.objectContaining({
        method: "POST",
        body: expect.any(FormData),
      })
    );
  });

  it("throws when upload fails", async () => {
    (global as any).fetch.mockResolvedValueOnce({ ok: false });

    const files = [new File(["a"], "a.png", { type: "image/png" })];
    await expect(uploadImages(files)).rejects.toThrow("Image upload failed");
  });
});
