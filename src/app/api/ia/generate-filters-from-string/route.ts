import { NextResponse } from "next/server";
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
import { GeneratedFiltersSchema } from "@/types/ai";
import { tryParseAndValidate } from "@/lib/ai/ai-utils";

/**
 * POST /api/filters
 *
 * Converts a free-form natural language shopping query into a structured filters object.
 *
 * @param {Request} request - The HTTP request containing `string`.
 * @returns {Promise<NextResponse>}
 *
 * @example
 * // Request
 * POST /api/ia/generate-filters-from-string
 *  "adidas samba, nike, red, blue, 41, 42, casual, men, below 200"
 *
 * // Success Response
 * 200 OK
 * {
 *   "redirectUrl": "/?searchTerm=Samba&brand=Adidas&brand=Nike&categories=Casual&color=Red&color=Blue&size=41&size=42&gender=Men&priceMin=0&priceMax=200",
 *   "explain_short": "Adidas/Nike men's casual Samba shoes, red/blue, size 41/42, max price 200."
 * }
 */

/**
 * POST /api/ia/generate-filters-from-string
 *
 * This endpoint generates filters from a natural language string.
 * It requires the user to be authenticated and the base prompt to be provided in the request body.
 *
 * @component
 *
 * @param {Request} req - The request object
 * @returns {Promise<NextResponse>} The response object
 */
export async function POST(req: Request) {
  try {
    const basePrompt = await req.json();
    if (!basePrompt) {
      return NextResponse.json(
        { error: "Some required field is missing" },
        { status: 400 }
      );
    }

    const [
      brandOptions,
      colorOptions,
      sizeOptions,
      categoryOptions,
      genderOptions,
    ] = await Promise.all([
      fetchBrands(),
      fetchColors(),
      fetchSizes(),
      fetchCategories(),
      fetchGenders(),
    ]);

    const brandLabels = brandOptions
      .map((o: { label: string; value: number }) => o.label)
      .join(", ");
    const colorLabels = colorOptions
      .map((o: { label: string; value: number }) => o.label)
      .join(", ");
    const sizeLabels = sizeOptions
      .map((o: { label: number; value: number }) => o.label)
      .join(", ");
    const categoryLabels = categoryOptions
      .map((o: { label: string; value: number }) => o.label)
      .join(", ");
    const genderLabels = genderOptions
      .map((o: { label: string; value: number }) => o.label)
      .join(", ");

    const prompt = `You convert natural-language shopping queries into a strict JSON filter object.
Always return arrays for brands, colors, categories, and sizes (even if only one item is present).
Only include values that exist in the provided options. If a requested value is not present, omit it.
Prefer exact option labels; do not invent new labels.
Prices are numbers (no currency symbols). If the user says "under X", use price_max = X.
If "over X", use price_min = X. If a range is present, set both price_min and price_max.
If user provided a price min, but didn't provide a prica max, always set it up to 500.
If user provided a price max, but didn't provide a price min, always set it up to 0;
If the user doesn't provide any price range, set them both to 0.
Keep explain_short as a tiny summary if helpful (<= 140 chars) or empty.
If something seems to be a shoe name, you should add it as a search param trying to fix typos if there is some.

example input: "I want an Adidas or Nike shoes, casual, with a 42 size, color black, and with a price of no more than 100"

example output:{
  "brands": ["Adidas","Nike"],        
  "categories": ["Casual"],           
  "price_min": 0,                      
  "price_max": 100,                      
  "colors": ["Black"], 
  "genders": []     
  "sizes": [42], 
  "searchTerm": "",                      
  "explain_short": "one-line reasoning"
}


OPTIONS\nBrands: ${brandLabels}\nColors: ${colorLabels}\nSizes: ${sizeLabels}\nCategories: ${categoryLabels}\n Genders: ${genderLabels}\n
USER_QUERY\n"""${basePrompt}"""`;

    const aiResp = await generateText({
      model: google("gemini-2.5-flash"),
      prompt,
    });

    const textPart = aiResp.content.find((c) => c.type === "text")?.text ?? "";

    const cleaned = textPart.replace(/```json|```/g, "").trim();

    const parsedResult = tryParseAndValidate(cleaned, GeneratedFiltersSchema);
    if (!parsedResult.success) {
      console.error("Invalid AI response", parsedResult.errors);
      return NextResponse.json(
        { error: "Invalid AI response" },
        { status: 422 }
      );
    }

    const validated = validateAIResponse(parsedResult.data, {
      brands: brandOptions,
      colors: colorOptions,
      sizes: sizeOptions,
      categories: categoryOptions,
      genders: genderOptions,
    });

    const filters = aiLabelsToFilters(validated);

    const redirectUrl = filtersToQueryString(filters);

    return NextResponse.json(
      { redirectUrl: redirectUrl, explain_short: validated.explain_short },
      { status: 200 }
    );
  } catch (err) {
    console.error("error generating filters", err);
    return NextResponse.json({ redirectUrl: "/" }, { status: 500 });
  }
}
