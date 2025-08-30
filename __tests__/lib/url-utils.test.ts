import { urlToFile, generateRandomFileName } from "@/lib/url-utils";

describe("url-utils", () => {
  beforeAll(() => {
    jest.spyOn(global.crypto, "randomUUID").mockReturnValue("mock-uuid");
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("generateRandomFileName", () => {
    it("generates a filename with provided extension", () => {
      const result = generateRandomFileName("png");
      expect(result).toBe("mock-uuid.png");
    });

    it("defaults to jpg when no extension is provided", () => {
      const result = generateRandomFileName();
      expect(result).toBe("mock-uuid.jpg");
    });
  });

  describe("urlToFile", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("converts a URL to a File with correct name and type", async () => {
      const mockBlob = new Blob(["test content"], { type: "image/png" });
      const mockResponse = {
        blob: jest.fn().mockResolvedValue(mockBlob),
      };

      global.fetch = jest.fn().mockResolvedValue(mockResponse as any);

      const file = await urlToFile("https://example.com/image.png");

      expect(global.fetch).toHaveBeenCalledWith(
        "https://example.com/image.png",
      );
      expect(file).toBeInstanceOf(File);
      expect(file.type).toBe("image/png");
      expect(file.name).toBe("mock-uuid.png");
    });

    it("falls back to jpg if blob type has no extension", async () => {
      const mockBlob = new Blob(["test content"], {
        type: "application/octet-stream",
      });
      const mockResponse = { blob: jest.fn().mockResolvedValue(mockBlob) };

      global.fetch = jest.fn().mockResolvedValue(mockResponse as any);

      const file = await urlToFile("https://example.com/file.bin");

      expect(file.name).toBe("mock-uuid.octet-stream");
    });

    it("throws if fetch fails", async () => {
      global.fetch = jest
        .fn()
        .mockRejectedValue(new TypeError("Network error"));

      await expect(urlToFile("https://bad-url.com/img.png")).rejects.toThrow(
        TypeError,
      );
    });

    it("throws if File is not supported", async () => {
      const mockBlob = new Blob(["x"], { type: "image/jpeg" });
      const mockResponse = { blob: jest.fn().mockResolvedValue(mockBlob) };

      global.fetch = jest.fn().mockResolvedValue(mockResponse as any);

      const originalFile = global.File;
      delete global.File;

      await expect(urlToFile("https://example.com/img.jpg")).rejects.toThrow();

      global.File = originalFile;
    });
  });
});
