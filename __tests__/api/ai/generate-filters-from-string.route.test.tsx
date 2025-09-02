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
jest.mock("@/lib/ai/ai-utils", () => ({ tryParseAndValidate: jest.fn() }));
jest.mock("@/types/ai", () => ({ GeneratedFiltersSchema: {} as any }));

import { POST } from "@/app/api/ia/generate-filters-from-string/route";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { fetchBrands } from "@/lib/actions/fetch-brands";
import { fetchColors } from "@/lib/actions/fetch-colors";
import { fetchSizes } from "@/lib/actions/fetch-sizes";
import { fetchCategories } from "@/lib/actions/fetch-categories";
import { fetchGenders } from "@/lib/actions/fetch-genders";
import { filtersToQueryString } from "@/lib/ai/filters-to-query-string";
import { aiLabelsToFilters } from "@/lib/ai/ai-labels-to-filters";
import { validateAIResponse } from "@/lib/ai/validate-ai-response";
import { tryParseAndValidate } from "@/lib/ai/ai-utils";

const fakeReq = (body: any) => ({ json: async () => body } as any);

const BRANDS = [
  { label: "Adidas", value: 1 },
  { label: "Nike", value: 2 },
];
const COLORS = [
  { label: "Red", value: 10 },
  { label: "Blue", value: 11 },
  { label: "Black", value: 12 },
];
const SIZES = [
  { label: 41, value: 41 },
  { label: 42, value: 42 },
];
const CATEGORIES = [{ label: "Casual", value: 100 }];
const GENDERS = [
  { label: "Men", value: 200 },
  { label: "Women", value: 201 },
];

describe("POST /api/ia/generate-filters-from-string", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (fetchBrands as jest.Mock).mockResolvedValue(BRANDS);
    (fetchColors as jest.Mock).mockResolvedValue(COLORS);
    (fetchSizes as jest.Mock).mockResolvedValue(SIZES);
    (fetchCategories as jest.Mock).mockResolvedValue(CATEGORIES);
    (fetchGenders as jest.Mock).mockResolvedValue(GENDERS);
  });

  it("returns 400 when basePrompt is missing", async () => {
    const res = await POST(fakeReq(null));
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({
      error: "Some required field is missing",
    });
    expect(generateText).not.toHaveBeenCalled();
  });

  it("returns 200 with redirectUrl and explain_short when parsing/validation succeed", async () => {
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
                brands: ["Adidas", "Nike"],
                categories: ["Casual"],
                price_min: 0,
                price_max: 200,
                colors: ["Red", "Blue"],
                genders: ["Men"],
                sizes: [41, 42],
                searchTerm: "Samba",
                explain_short:
                  "Adidas/Nike men's casual Samba shoes, red/blue, size 41/42, max price 200.",
              }) +
              "\n```",
          },
        ],
      };
    });

    (tryParseAndValidate as jest.Mock).mockReturnValueOnce({
      success: true,
      data: {
        brands: ["Adidas", "Nike"],
        categories: ["Casual"],
        price_min: 0,
        price_max: 200,
        colors: ["Red", "Blue"],
        genders: ["Men"],
        sizes: [41, 42],
        searchTerm: "Samba",
        explain_short:
          "Adidas/Nike men's casual Samba shoes, red/blue, size 41/42, max price 200.",
      },
    });

    (validateAIResponse as jest.Mock).mockReturnValue({
      brands: ["Adidas", "Nike"],
      categories: ["Casual"],
      price_min: 0,
      price_max: 200,
      colors: ["Red", "Blue"],
      genders: ["Men"],
      sizes: [41, 42],
      searchTerm: "Samba",
      explain_short:
        "Adidas/Nike men's casual Samba shoes, red/blue, size 41/42, max price 200.",
    });

    (aiLabelsToFilters as jest.Mock).mockReturnValue({
      brands: [1, 2],
      categories: [100],
      price_min: 0,
      price_max: 200,
      colors: [10, 11],
      genders: [200],
      sizes: [41, 42],
      searchTerm: "Samba",
      explain_short:
        "Adidas/Nike men's casual Samba shoes, red/blue, size 41/42, max price 200.",
    });

    (filtersToQueryString as jest.Mock).mockReturnValue(
      "/?searchTerm=Samba&brand=Adidas&brand=Nike&categories=Casual&color=Red&color=Blue&size=41&size=42&gender=Men&priceMin=0&priceMax=200"
    );

    const userQuery =
      "adidas samba, nike, red, blue, 41, 42, casual, men, below 200";
    const res = await POST(fakeReq(userQuery));

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({
      redirectUrl:
        "/?searchTerm=Samba&brand=Adidas&brand=Nike&categories=Casual&color=Red&color=Blue&size=41&size=42&gender=Men&priceMin=0&priceMax=200",
      explain_short:
        "Adidas/Nike men's casual Samba shoes, red/blue, size 41/42, max price 200.",
    });

    expect(google).toHaveBeenCalledWith("gemini-2.5-flash");
    expect(generateText).toHaveBeenCalledTimes(1);
    expect(capturedArgs?.prompt).toContain("OPTIONS");
    expect(capturedArgs?.prompt).toContain("Brands: Adidas, Nike");
    expect(capturedArgs?.prompt).toContain("Colors: Red, Blue, Black");
    expect(capturedArgs?.prompt).toContain("Sizes: 41, 42");
    expect(capturedArgs?.prompt).toContain("Categories: Casual");
    expect(capturedArgs?.prompt).toContain("Genders: Men, Women");
    expect(capturedArgs?.prompt).toContain("USER_QUERY");
    expect(capturedArgs?.prompt).toContain(userQuery);

    expect(validateAIResponse).toHaveBeenCalledWith(expect.any(Object), {
      brands: BRANDS,
      colors: COLORS,
      sizes: SIZES,
      categories: CATEGORIES,
      genders: GENDERS,
    });
    expect(aiLabelsToFilters).toHaveBeenCalledWith(
      expect.objectContaining({ brands: ["Adidas", "Nike"] })
    );
    expect(filtersToQueryString).toHaveBeenCalledWith(
      expect.objectContaining({ brands: [1, 2] })
    );
  });

  it("returns 422 when AI response is invalid against schema", async () => {
    const errSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (generateText as jest.Mock).mockResolvedValueOnce({
      content: [{ type: "text", text: "```json\n{}\n```" }],
    });
    (tryParseAndValidate as jest.Mock).mockReturnValueOnce({
      success: false,
      errors: ["bad shape"],
    });

    const res = await POST(fakeReq("something"));
    expect(res.status).toBe(422);
    await expect(res.json()).resolves.toEqual({ error: "Invalid AI response" });

    errSpy.mockRestore();
  });

  it("returns 500 when an unexpected error happens", async () => {
    const errSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (generateText as jest.Mock).mockRejectedValueOnce(new Error("boom"));

    const res = await POST(fakeReq("anything"));
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({ redirectUrl: "/" });

    errSpy.mockRestore();
  });
});
