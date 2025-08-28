import { NextResponse } from "next/server";
import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { GeneratedProductDescriptionSchema } from "@/types/ai";
import { tryParseAndValidate } from "@/lib/ai/ai-utils";

/**
 * Handles POST requests to generate a structured AI-powered product description.
 *
 * This function:
 * - Accepts a product `name` from the request body.
 * - Uses the Groq LLM to generate a structured JSON response with:
 *   - `name`: the product title.
 *   - `isBranded`: whether the product appears to be branded.
 *   - `description`: a concise product description (≤ 300 characters).
 *   - `confidence`: numeric confidence score (0–1) for brand detection.
 * - Validates the AI output against the `GeneratedProductDescriptionSchema`.
 * - Retries once with a stricter prompt if the first attempt is invalid.
 *
 * @async
 * @function POST
 * @param {Request} req - The incoming request object, expected to contain `{ name: string, brand: string, category: string, description: string, genre:string }` in JSON format.
 * @returns {Promise<NextResponse>}
 * - `200 OK` with valid structured JSON matching `GeneratedProductDescriptionSchema`.
 * - `400 Bad Request` if no `name` is provided.
 * - `500 Internal Server Error` if AI fails to produce valid JSON or other errors occur.
 *
 * // Success response
 * {
 *   "name": "Nike Air Zoom Pegasus 39",
 *   "isBranded": true,
 *   "description": "Lightweight running shoe built for speed and comfort.",
 *   "confidence": 0.87
 * }
 */

export async function POST(req: Request) {
  try {
    const { name, brand, category, description, genre } = await req.json();
    if (!name || !brand || !category || !description || !genre) {
      return NextResponse.json(
        { error: "Some required field is missing" },
        { status: 400 }
      );
    }
    const basePrompt = `You are a strict JSON generator.  
You will receive a product object with the following fields: name, brand, category, description, and genre.  

Your tasks:  
1) Determine whether the product **appears to be branded** (use the name + brand). If branded, set "isBranded": true, otherwise false.  
2) Provide a numeric confidence score between 0 and 1 for your brand detection decision.  
3) Generate a concise and improved product description if there is already one(≤ 500 characters).  
   - Use the input description field only as a hint/context, but rephrase it in a more polished, marketing-ready way.  
   - Incorporate brand, category, and genre naturally when relevant.  

Return:  
Only a single JSON object EXACTLY matching this schema (no text, no markdown, no commentary).  

Input example:
{
"name": "Adizero EVO SL Shoes",
"brand": "Adidas",
"category":"Running",
"description": "",
"genre":"man"
}

Output example:
{
  "name": "Adizero EVO SL Shoes",
  "isBranded": true,
  "description": "Experience the feeling of fast in the Adizero Evo SL. Inspired by the innovation of record-breaking shoes in the Adizero running family - and specifically the Pro Evo 1 - the Evo SL is designed for you to run in it, or not. Combining Adizero technology with a bold and unique racing-inspired aesthetic, it's an evolution of speed in all aspects of life. A responsive layer of LIGHTSTRIKE PRO foam in the midsole provides comfort and cushioning for optimal energy return",
  "confidence": 0.94
}

Input product:
${JSON.stringify({ name, brand, category, description, genre })}
`;

    const { text } = await generateText({
      model: groq("compound-beta"),
      prompt: basePrompt,
    });

    const parsed = tryParseAndValidate(text, GeneratedProductDescriptionSchema);
    if (parsed.success) {
      return NextResponse.json(parsed.data);
    }

    const retryPrompt = `RETURN ONLY VALID JSON. NO text, no markdown. Reproduce a JSON object that matches the schema exactly. Input title: "${name}".`;
    const { text: retryText } = await generateText({
      model: groq("compound-beta"),
      prompt: retryPrompt,
    });

    const retryParsed = tryParseAndValidate(
      retryText,
      GeneratedProductDescriptionSchema
    );
    if (retryParsed.success) {
      return NextResponse.json(retryParsed.data);
    }

    console.error("AI outputs not valid JSON:", { text, retryText });
    return NextResponse.json(
      { error: "Failed to generate structured JSON" },
      { status: 500 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error generating description" },
      { status: 500 }
    );
  }
}
