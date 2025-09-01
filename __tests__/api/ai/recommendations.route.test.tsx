import "@testing-library/jest-dom";

jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: any, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));
jest.mock("ai", () => ({ generateText: jest.fn() }));
jest.mock("@ai-sdk/google", () => ({ google: jest.fn(() => "mock-gemini") }));

jest.mock("@/lib/actions/get-full-product", () => ({
  getFullProduct: jest.fn(),
}));
jest.mock("@/lib/normalizers/normalize-product-card", () => ({
  normalizeFullProduct: jest.fn(),
}));
jest.mock("@/lib/actions/fetch-brands", () => ({ fetchBrands: jest.fn() }));
jest.mock("@/lib/actions/fetch-colors", () => ({ fetchColors: jest.fn() }));
jest.mock("@/lib/actions/fetch-sizes", () => ({ fetchSizes: jest.fn() }));
jest.mock("@/lib/actions/fetch-categories", () => ({
  fetchCategories: jest.fn(),
}));
jest.mock("@/lib/actions/fetch-genders", () => ({ fetchGenders: jest.fn() }));

jest.mock("@/lib/ai/filters-to-query-string", () => ({
  filtersToQueryString: jest.fn(),
}));
jest.mock("@/lib/ai/ai-labels-to-filters", () => ({
  aiLabelsToFilters: jest.fn(),
}));
jest.mock("@/lib/ai/validate-ai-response", () => ({
  validateAIResponse: jest.fn(),
}));

import { POST } from "@/app/api/ia/recommendations/route";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getFullProduct } from "@/lib/actions/get-full-product";
import { normalizeFullProduct } from "@/lib/normalizers/normalize-product-card";
import { fetchBrands } from "@/lib/actions/fetch-brands";
import { fetchColors } from "@/lib/actions/fetch-colors";
import { fetchSizes } from "@/lib/actions/fetch-sizes";
import { fetchCategories } from "@/lib/actions/fetch-categories";
import { fetchGenders } from "@/lib/actions/fetch-genders";
import { filtersToQueryString } from "@/lib/ai/filters-to-query-string";
import { aiLabelsToFilters } from "@/lib/ai/ai-labels-to-filters";
import { validateAIResponse } from "@/lib/ai/validate-ai-response";

const fakeReq = (body: any) => ({ json: async () => body } as any);

const BRANDS = [
  { label: "Adidas", value: 1 },
  { label: "Nike", value: 2 },
  { label: "Puma", value: 3 },
];
const COLORS = [
  { label: "Black", value: 10 },
  { label: "White", value: 11 },
  { label: "Red", value: 12 },
];
const SIZES = [
  { label: 42, value: 42 },
  { label: 43, value: 43 },
];
const CATEGORIES = [{ label: "Casual", value: 100 }];
const GENDERS = [{ label: "Men", value: 200 }];

describe("POST /api/ia/recommendations", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    (fetchBrands as jest.Mock).mockResolvedValue(BRANDS);
    (fetchColors as jest.Mock).mockResolvedValue(COLORS);
    (fetchSizes as jest.Mock).mockResolvedValue(SIZES);
    (fetchCategories as jest.Mock).mockResolvedValue(CATEGORIES);
    (fetchGenders as jest.Mock).mockResolvedValue(GENDERS);

    (getFullProduct as jest.Mock).mockImplementation(async (id: string) => ({
      data: { id: Number(id), name: `Product ${id}` },
    }));

    (normalizeFullProduct as jest.Mock).mockImplementation((data: any) => ({
      id: data.id,
      name: data.name,
      brand: data.id % 2 === 0 ? "Nike" : "Adidas",
      color: data.id % 2 === 0 ? "Black" : "White",
      size: 42 + (data.id % 2),
      category: "Casual",
      price: 100 + (data.id % 3) * 20,
      gender: "Men",
    }));
  });

  it("returns {recommendations: []} when ids missing or empty", async () => {
    const res1 = await POST(fakeReq({}));
    expect(res1.status).toBe(200);
    await expect(res1.json()).resolves.toEqual({ recommendations: [] });
    expect(generateText).not.toHaveBeenCalled();

    const res2 = await POST(fakeReq({ ids: [] }));
    expect(res2.status).toBe(200);
    await expect(res2.json()).resolves.toEqual({ recommendations: [] });
    expect(generateText).not.toHaveBeenCalled();
  });

  it("returns 200 with redirectUrl + ai when everything succeeds", async () => {
    const ids = [101, 205, 305, 407, 409];

    let capturedArgs: any;
    (generateText as jest.Mock).mockImplementationOnce(async (args) => {
      capturedArgs = args;
      return {
        content: [
          {
            type: "text",
            text:
              "```json\n" +
              JSON.stringify({
                brands: ["Adidas", "Puma"],
                categories: ["Casual"],
                price_min: 40,
                price_max: 190,
                colors: ["Black", "White"],
                sizes: [42, 43],
                genders: ["Men"],
                explain_short:
                  "Recommendations based on your recently viewed products, focusing on similar attributes and an expanded price range.",
                searchTerm: "",
              }) +
              "\n```",
          },
        ],
      };
    });

    (validateAIResponse as jest.Mock).mockReturnValue({
      brands: ["Adidas", "Puma"],
      categories: ["Casual"],
      price_min: 40,
      price_max: 190,
      colors: ["Black", "White"],
      sizes: [42, 43],
      genders: ["Men"],
      explain_short:
        "Recommendations based on your recently viewed products, focusing on similar attributes and an expanded price range.",
      searchTerm: "",
    });

    (aiLabelsToFilters as jest.Mock).mockReturnValue({
      brands: [1, 3],
      categories: [100],
      price_min: 40,
      price_max: 190,
      colors: [10, 11],
      sizes: [42, 43],
      genders: [200],
      searchTerm: "",
      explain_short:
        "Recommendations based on your recently viewed products, focusing on similar attributes and an expanded price range.",
    });

    (filtersToQueryString as jest.Mock).mockReturnValue(
      "/?brand=Adidas&brand=Puma&categories=Casual&color=Black&color=White&size=42&size=43&gender=Men&priceMin=40&priceMax=190"
    );

    const res = await POST(fakeReq({ ids }));
    expect(res.status).toBe(200);

    await expect(res.json()).resolves.toEqual({
      redirectUrl:
        "/?brand=Adidas&brand=Puma&categories=Casual&color=Black&color=White&size=42&size=43&gender=Men&priceMin=40&priceMax=190",
      ai: {
        brands: ["Adidas", "Puma"],
        categories: ["Casual"],
        price_min: 40,
        price_max: 190,
        colors: ["Black", "White"],
        sizes: [42, 43],
        genders: ["Men"],
        searchTerm: "",
        explain_short:
          "Recommendations based on your recently viewed products, focusing on similar attributes and an expanded price range.",
      },
    });

    expect(google).toHaveBeenCalledWith("gemini-2.5-flash");
    expect(generateText).toHaveBeenCalledTimes(1);

    expect(getFullProduct).toHaveBeenCalledTimes(ids.length);
    ids.forEach((id) =>
      expect(getFullProduct).toHaveBeenCalledWith(String(id))
    );

    expect(normalizeFullProduct).toHaveBeenCalledTimes(ids.length);

    expect(capturedArgs?.prompt).toContain("OPTIONS");
    expect(capturedArgs?.prompt).toContain("Brands: Adidas, Nike, Puma");
    expect(capturedArgs?.prompt).toContain("Colors: Black, White, Red");
    expect(capturedArgs?.prompt).toContain("Sizes: 42, 43");
    expect(capturedArgs?.prompt).toContain("Categories: Casual");
    expect(capturedArgs?.prompt).toContain("Genders: Men");
    expect(capturedArgs?.prompt).toContain("Input:");
    expect(capturedArgs?.prompt).toContain("Product 101");

    expect(validateAIResponse).toHaveBeenCalledWith(expect.any(Object), {
      brands: BRANDS,
      colors: COLORS,
      sizes: SIZES,
      categories: CATEGORIES,
      genders: GENDERS,
    });

    expect(aiLabelsToFilters).toHaveBeenCalledWith(
      expect.objectContaining({ brands: ["Adidas", "Puma"] })
    );
    expect(filtersToQueryString).toHaveBeenCalledWith(
      expect.objectContaining({ brands: [1, 3] })
    );
  });

  it("defaults ai.explain_short to empty string if missing", async () => {
    (generateText as jest.Mock).mockResolvedValueOnce({
      content: [
        {
          type: "text",
          text:
            "```json\n" +
            JSON.stringify({
              brands: ["Adidas", "Puma"],
              categories: ["Casual"],
              price_min: 40,
              price_max: 190,
              colors: ["Black", "White"],
              sizes: [42, 43],
              genders: ["Men"],
              searchTerm: "",
            }) +
            "\n```",
        },
      ],
    });

    (validateAIResponse as jest.Mock).mockReturnValue({
      brands: ["Adidas", "Puma"],
      categories: ["Casual"],
      price_min: 40,
      price_max: 190,
      colors: ["Black", "White"],
      sizes: [42, 43],
      genders: ["Men"],
      searchTerm: "",
    });

    (aiLabelsToFilters as jest.Mock).mockReturnValue({
      brands: [1, 3],
      categories: [100],
      price_min: 40,
      price_max: 190,
      colors: [10, 11],
      sizes: [42, 43],
      genders: [200],
      searchTerm: "",
    });

    (filtersToQueryString as jest.Mock).mockReturnValue(
      "/?brand=Adidas&brand=Puma&categories=Casual&color=Black&color=White&size=42&size=43&gender=Men&priceMin=40&priceMax=190"
    );

    const ids = [101, 205, 305, 407, 409];
    const res = await POST(fakeReq({ ids }));
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.redirectUrl).toBe(
      "/?brand=Adidas&brand=Puma&categories=Casual&color=Black&color=White&size=42&size=43&gender=Men&priceMin=40&priceMax=190"
    );
    expect(body.ai.explain_short).toBe("");
  });

  it("returns 500 + redirectUrl '/' on unexpected error", async () => {
    const errSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (generateText as jest.Mock).mockRejectedValueOnce(new Error("boom"));

    const res = await POST(fakeReq({ ids: [1, 2, 3, 4, 5] }));
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({ redirectUrl: "/" });

    errSpy.mockRestore();
  });
});
