import {
  generateFiltersFromString,
  GenerateFiltersResponse,
} from "@/lib/ai/generate-filters-from-string";

describe("generateFiltersFromString", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("throws an error if query is empty", async () => {
    await expect(generateFiltersFromString("")).rejects.toThrow("Empty query");
    await expect(generateFiltersFromString("   ")).rejects.toThrow(
      "Empty query",
    );
  });

  it("throws an error if fetch response is not ok", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValueOnce({}),
    });

    await expect(generateFiltersFromString("test")).rejects.toThrow(
      "AI endpoint returned status 500",
    );
  });

  it("throws an error if fetch json fails", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockRejectedValueOnce(new Error("Invalid JSON")),
    });

    await expect(generateFiltersFromString("test")).rejects.toThrow(
      "AI endpoint returned status undefined",
    );
  });

  it("throws an error if redirectUrl is missing in payload", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ explain_short: "desc" }),
    });

    await expect(generateFiltersFromString("test")).rejects.toThrow(
      "AI response missing redirectUrl",
    );
  });

  it("returns the response correctly if valid", async () => {
    const mockPayload = {
      redirectUrl: "/products?brand=nike",
      explain_short: "Recommended filters",
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockPayload),
    });

    const result: GenerateFiltersResponse =
      await generateFiltersFromString("test query");
    expect(result).toEqual(mockPayload);
  });

  it("fills explain_short with empty string if missing", async () => {
    const mockPayload = {
      redirectUrl: "/products?brand=nike",
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockPayload),
    });

    const result: GenerateFiltersResponse =
      await generateFiltersFromString("test query");
    expect(result).toEqual({
      redirectUrl: "/products?brand=nike",
      explain_short: "",
    });
  });
});
