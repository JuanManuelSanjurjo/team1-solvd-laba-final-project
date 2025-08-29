import { generateDescription } from "@/lib/ai/generate-description";
import { GeneratedProductDescription } from "@/types/ai";

describe("generateDescription", () => {
  const mockPayload = {
    name: "Nike Air Zoom Pegasus 39",
    brand: "Nike",
    category: "Running Shoes",
    color: "Red",
    gender: "Men",
    description: "Lightweight running shoes",
  };

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("returns a structured description when API responds ok", async () => {
    const mockResponse: GeneratedProductDescription = {
      name: mockPayload.name,
      isBranded: true,
      description: "Lightweight running shoe built for speed and comfort.",
      confidence: 0.87,
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await generateDescription(mockPayload);
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith("/api/ia/generate-description", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockPayload),
    });
  });

  it("throws an error with API error message if response not ok", async () => {
    const mockError = { error: "AI service unavailable" };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValueOnce(mockError),
    });

    await expect(generateDescription(mockPayload)).rejects.toThrow(
      "AI service unavailable",
    );
  });

  it("throws default error if response not ok and json fails", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockRejectedValueOnce(new Error("Invalid JSON")),
    });

    await expect(generateDescription(mockPayload)).rejects.toThrow("unknown");
  });
});
