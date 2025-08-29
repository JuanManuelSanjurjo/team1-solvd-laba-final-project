import { fetchRecommendations } from "@/lib/ai/generate-filter-recommendations";

describe("fetchRecommendations", () => {
  const ids = [1, 2, 3];

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("calls fetch with correct endpoint and payload", async () => {
    const mockData = [{ id: 4, name: "Recommended Product" }];
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    const result = await fetchRecommendations(ids);

    expect(fetch).toHaveBeenCalledWith("/api/ia/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    expect(result).toEqual(mockData);
  });

  it("throws an error if response is not ok", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    await expect(fetchRecommendations(ids)).rejects.toThrow(
      "Failed to fetch recommendations",
    );
  });

  it("returns empty array if API returns empty list", async () => {
    const mockData: any[] = [];
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    const result = await fetchRecommendations(ids);
    expect(result).toEqual([]);
  });
});
