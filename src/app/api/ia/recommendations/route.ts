import { NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { normalizeFullProduct } from "@/lib/normalizers/normalize-product-card";
import { getFullProduct } from "@/lib/actions/get-full-product";
import { fetchBrands } from "@/lib/actions/fetch-brands";
import { fetchColors } from "@/lib/actions/fetch-colors";
import { fetchSizes } from "@/lib/actions/fetch-sizes";
import { fetchCategories } from "@/lib/actions/fetch-categories";
import { validateAIResponse } from "@/lib/ai/ai-utils";
import { ProductFilters } from "@/types/product";

type ReqBody = { ids: number[] };

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

    const [brandOptions, colorOptions, sizeOptions, categoryOptions] =
      await Promise.all([
        fetchBrands(),
        fetchColors(),
        fetchSizes(),
        fetchCategories(),
      ]);

    const products = details.map((product) =>
      normalizeFullProduct(product.data)
    );
    console.log(products);

    const prompt = `
You are a product-recommendation assistant. 
Input: an array of products the user recently viewed...
Return: filters for products that are **similar but not the exact same.** 
Price range should vary by at least ±50 dollars, and it would be based on the range of the recently viewed products. 
You should prioritize diversity in brand, category, or color if possible.

These are the available colors, brands, categories and sizes:
Brand Options: ${JSON.stringify(brandOptions)}
Color Options: ${JSON.stringify(colorOptions)}
Sizes Options: ${JSON.stringify(sizeOptions)}
Category Options: ${JSON.stringify(brandOptions)}

If the input includes a brand, suggest 1–2 related or alternative brands (Only brands available on Brand Options). 
If the input includes a color, suggest complementary or neighboring colors (Only colors available on Color Options). 
If the input includes a category, suggest at least one related category (Only categories available on Category Options).

{
  "brands": ["brand1","brand2"],         // up to 3 brands to prioritize
  "categories": ["casual"],              // categories/tags
  "price_min": 0,                        // recommended min price (integer)
  "price_max": 0,                        // recommended max price (integer) 
  "colors": ["black","white"],           // colors to prioritize
  "sizes": [42,43],                      // sizes to prioritize if present
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

    const text = aiResp.content.find((c) => c.type === "text")?.text ?? "";
    console.log(text);

    const textPart = aiResp.content.find((c) => c.type === "text")?.text ?? "";

    const cleaned = textPart.replace(/```json|```/g, "").trim();

    let parsed: any;
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
    });

    const filters = aiLabelsToFilters(validated);

    console.log("AI filters:", filters);

    const redirectUrl = filtersToQueryString(filters);

    console.log("Redirect URL:", redirectUrl);

    return NextResponse.json({
      redirectUrl,
      ai: {
        ...validated,
        explain_short: validated.explain_short ?? "",
      },
    });
  } catch (err: any) {
    console.error("recommendations error", err);
    return NextResponse.json({ redirectUrl: "/", ai: null }, { status: 500 });
  }
}

function aiLabelsToFilters(ai: any): ProductFilters {
  const filters: Partial<ProductFilters> = {};

  if (Array.isArray(ai.brands) && ai.brands.length) filters.brands = ai.brands;
  if (Array.isArray(ai.categories) && ai.categories.length)
    filters.categories = ai.categories;
  if (Array.isArray(ai.colors) && ai.colors.length) filters.colors = ai.colors;
  if (Array.isArray(ai.sizes) && ai.sizes.length) filters.sizes = ai.sizes;

  if (typeof ai.price_min === "number") filters.priceMin = ai.price_min;
  if (typeof ai.price_max === "number") filters.priceMax = ai.price_max;

  return filters as ProductFilters;
}

function filtersToQueryString(filters: Partial<ProductFilters>) {
  const params = new URLSearchParams();

  if (Array.isArray(filters.brands) && filters.brands.length) {
    filters.brands.forEach((b) => params.append("brand", String(b)));
  }
  if (Array.isArray(filters.categories) && filters.categories.length) {
    filters.categories.forEach((c) => params.append("categories", String(c)));
  }
  if (Array.isArray(filters.colors) && filters.colors.length) {
    filters.colors.forEach((c) => params.append("color", String(c)));
  }
  if (Array.isArray(filters.sizes) && filters.sizes.length) {
    filters.sizes.forEach((s) => params.append("size", String(s)));
  }

  if (typeof filters.priceMin === "number") {
    params.set("priceMin", String(filters.priceMin));
  }
  if (typeof filters.priceMax === "number") {
    params.set("priceMax", String(filters.priceMax));
  }

  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}
