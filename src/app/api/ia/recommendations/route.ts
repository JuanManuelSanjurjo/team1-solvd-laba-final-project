import { NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { normalizeFullProduct } from "@/lib/normalizers/normalize-product-card";
import { getFullProduct } from "@/lib/actions/get-full-product";
import { fetchBrands } from "@/lib/actions/fetch-brands";
import { fetchColors } from "@/lib/actions/fetch-colors";
import { fetchSizes } from "@/lib/actions/fetch-sizes";
import { fetchCategories } from "@/lib/actions/fetch-categories";
import { filtersToQueryString } from "@/lib/ai/filters-to-query-string";
import { aiLabelsToFilters } from "@/lib/ai/ai-labels-to-filters";
import { fetchGenders } from "@/lib/actions/fetch-genders";
import { validateAIResponse } from "@/lib/ai/validate-ai-response";
import { redirect } from "next/dist/server/api-utils";

type ReqBody = { ids: number[] };

/**
 * POST /api/recommendations
 *
 * Generates AI-powered product recommendations based on a array of viewed product IDs.
 *
 * @param {Request} request - The HTTP request containing `{ ids: number[] }`.
 * @returns {Promise<NextResponse>}
 *
 * @example
 * // Request
 * POST /api/ia/recommendations
 * { "ids": [101, 205, 305, 407, 409] }
 *
 * // Success Response
 * 200 OK
 *{
 *   "redirectUrl": "/?brand=Adidas&brand=Puma&categories=Casual&color=Black&color=White&size=42&size=43&gender=Men&priceMin=40&priceMax=190",
 *   "ai": {
 *       "brands": [
 *           "Adidas",
 *           "Puma"
 *       ],
 *       "colors": [
 *           "Black",
 *           "White"
 *       ],
 *       "categories": [
 *           "Casual"
 *       ],
 *       "sizes": [
 *           42,
 *           43
 *       ],
 *       "genders": [
 *           "Men"
 *       ],
 *       "price_min": 40,
 *       "price_max": 190,
 *       "explain_short": "Recommendations based on your recently viewed products, focusing on similar attributes and an expanded price range.",
 *       "searchTerm": ""
 *   }
 *}
 * }
 */
export async function POST(req: Request) {
  try {
    const body: ReqBody = await req.json();
    const { ids } = body;
    if (!ids || !ids.length) {
      return NextResponse.json({ recommendations: [] });
    }

    const details = await Promise.all(
      ids.map((id) => getFullProduct(String(id)))
    );

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

    const products = details.map((product) =>
      normalizeFullProduct(product.data)
    );

    const prompt = `
You are a product-recommendation assistant. 
Input: an array of products the user recently viewed...
Return: filters for products that are **similar but not the exact same.** 

These are the available colors, brands, categories, sizes and genders:
OPTIONS\nBrands: ${brandLabels}\nColors: ${colorLabels}\nSizes: ${sizeLabels}\nCategories: ${categoryLabels}\n Genders: ${genderLabels}\n

You should return the 2 most repeated brands on the input, and suggest one (Only brands available on Brand Options with the EXACT same label). 
You should return the 2 most repeated colors on the input, and suggest one neighbor color (Only colors available on Color Options with the EXACT same label). 
You should return the 2 most repeated sizes on the input, and suggest one  (Only sizes available on Sizes Options with the EXACT same label). 
You should return the 2 most repeated categories on the input, and suggest one (Only categories available on Category Options with the EXACT same label).
You should return only the most repeated genre (Only Genres available on Genre Options with the EXACT same label).

Price range should vary by at least ±50 dollars, and it would be based on the range of the recently viewed products. 

OUTPUT EXAMPLE: 
{
  "brands": ["Adidas","Nike"],         
  "categories": ["Casual"],              
  "price_min": 0,                   
  "price_max": 0,                        
  "genders":["Women"]
  "colors": ["Black","White"],        
  "sizes": [42,43],                     
  "explain_short": "one-line reasoning"
}

Input:
${JSON.stringify(products, null, 2)}

Produce only valid JSON that conforms exactly to the schema above.
`;

    const aiResp = await generateText({
      model: google("gemini-2.5-flash"),
      prompt,
    });

    const textPart = aiResp.content.find((c) => c.type === "text")?.text ?? "";

    const cleaned = textPart.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("Failed to parse AI response:", err);
    }

    const validated = validateAIResponse(parsed, {
      brands: brandOptions,
      colors: colorOptions,
      sizes: sizeOptions,
      categories: categoryOptions,
      genders: genderOptions,
    });

    const filters = aiLabelsToFilters(validated);

    const redirectUrl = filtersToQueryString(filters);

    return NextResponse.json({
      redirectUrl,
      ai: {
        ...validated,
        explain_short: validated.explain_short ?? "",
      },
    });
  } catch (err) {
    console.error("recommendations error", err);
    return NextResponse.json({ redirectUrl: "/" }, { status: 500 });
  }
}
