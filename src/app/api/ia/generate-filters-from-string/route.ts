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

    const text = aiResp.content.find((c) => c.type === "text")?.text ?? "";
    console.log(text);

    const textPart = aiResp.content.find((c) => c.type === "text")?.text ?? "";

    const cleaned = textPart.replace(/```json|```/g, "").trim();

    console.log("cleaned--->", cleaned);

    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
      console.log("paresed--->", parsed);
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

    console.log("validated response--->", validated);

    const filters = aiLabelsToFilters(validated);

    console.log("built in filters--->", filters);

    console.log("AI filters:", filters);

    const redirectUrl = filtersToQueryString(filters);

    console.log("Redirect URL:", redirectUrl);
    return NextResponse.json(
      { redirectUrl: redirectUrl, explain_short: validated.explain_short },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("error generating filters", err);
    return NextResponse.json({ redirectUrl: "/", ai: null }, { status: 500 });
  }
}
