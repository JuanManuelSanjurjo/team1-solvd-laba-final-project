import "@testing-library/jest-dom";

jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: any, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

jest.mock("@ai-sdk/groq", () => ({
  groq: jest.fn(() => "mock-groq-model"),
}));
jest.mock("ai", () => ({
  generateText: jest.fn(),
}));
jest.mock("@/lib/ai/ai-utils", () => ({
  tryParseAndValidate: jest.fn(),
}));
jest.mock("@/types/ai", () => ({
  GeneratedProductDescriptionSchema: {} as any,
}));

import { POST } from "@/app/api/ia/generate-description/route";
import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { tryParseAndValidate } from "@/lib/ai/ai-utils";

const fakeReq = (body: any) => ({ json: async () => body } as any);

describe("POST /api/ai/generate-product-description", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await POST(fakeReq({ name: "Pegasus 39" }));
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({
      error: "Some required field is missing",
    });
    expect(generateText).not.toHaveBeenCalled();
  });

  it("returns 200 with parsed data when first attempt succeeds", async () => {
    (generateText as jest.Mock).mockResolvedValueOnce({ text: "{ok}" });
    (tryParseAndValidate as jest.Mock).mockReturnValueOnce({
      success: true,
      data: {
        name: "Nike Air Zoom Pegasus 39",
        isBranded: true,
        description: "Lightweight running shoe built for speed and comfort.",
        confidence: 0.87,
      },
    });

    const body = {
      name: "Pegasus 39",
      brand: "Nike",
      category: "Running",
      description: "",
      gender: "Men",
    };

    const res = await POST(fakeReq(body));
    expect(res.status).toBe(200);

    expect(groq).toHaveBeenCalledWith("compound-beta");
    expect(generateText).toHaveBeenCalledTimes(1);

    const [{ prompt }]: any = (generateText as jest.Mock).mock.calls[0] ?? [{}];
    expect(prompt).toContain("Input product:");
    expect(prompt).toContain('"brand":"Nike"');

    await expect(res.json()).resolves.toEqual({
      name: "Nike Air Zoom Pegasus 39",
      isBranded: true,
      description: "Lightweight running shoe built for speed and comfort.",
      confidence: 0.87,
    });
  });

  it("retries once and returns 200 when second attempt succeeds", async () => {
    let firstArgs: any;
    let secondArgs: any;

    (generateText as jest.Mock)
      .mockImplementationOnce(async (args) => {
        firstArgs = args;
        return { text: "not-valid-json" };
      })
      .mockImplementationOnce(async (args) => {
        secondArgs = args;
        return { text: "{valid}" };
      });

    (tryParseAndValidate as jest.Mock)
      .mockReturnValueOnce({ success: false })
      .mockReturnValueOnce({
        success: true,
        data: {
          name: "Adizero EVO SL Shoes",
          isBranded: true,
          description: "Short description here",
          confidence: 0.94,
        },
      });

    const body = {
      name: "Adizero EVO SL Shoes",
      brand: "Adidas",
      category: "Running",
      description: "",
      gender: "Men",
    };

    const res = await POST(fakeReq(body));
    expect(res.status).toBe(200);

    expect(firstArgs).toBeTruthy();
    expect(secondArgs).toBeTruthy();
    expect(secondArgs.prompt).toContain("RETURN ONLY VALID JSON");
    expect(secondArgs.prompt).toContain('Input title: "Adizero EVO SL Shoes"');

    await expect(res.json()).resolves.toEqual({
      name: "Adizero EVO SL Shoes",
      isBranded: true,
      description: "Short description here",
      confidence: 0.94,
    });
  });

  it("returns 500 when both attempts produce invalid JSON", async () => {
    (generateText as jest.Mock)
      .mockResolvedValueOnce({ text: "bad-1" })
      .mockResolvedValueOnce({ text: "bad-2" });

    (tryParseAndValidate as jest.Mock)
      .mockReturnValueOnce({ success: false })
      .mockReturnValueOnce({ success: false });

    const body = {
      name: "Alpha",
      brand: "Zeta",
      category: "Training",
      description: "",
      gender: "Women",
    };

    const res = await POST(fakeReq(body));
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({
      error: "Failed to generate structured JSON",
    });
  });

  it("returns 500 when an unexpected error is thrown", async () => {
    (generateText as jest.Mock).mockRejectedValueOnce(new Error("boom"));

    const body = {
      name: "Alpha",
      brand: "Zeta",
      category: "Training",
      description: "",
      gender: "Men",
    };

    const res = await POST(fakeReq(body));
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({
      error: "Error generating description",
    });
  });
});
