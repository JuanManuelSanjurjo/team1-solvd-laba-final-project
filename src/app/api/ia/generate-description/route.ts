import { NextResponse } from "next/server";
import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { GeneratedProductDescriptionSchema } from "@/types/ai";

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
 * @param {Request} req - The incoming request object, expected to contain `{ name: string }` in JSON format.
 * @returns {Promise<NextResponse>}
 * - `200 OK` with valid structured JSON matching `GeneratedProductDescriptionSchema`.
 * - `400 Bad Request` if no `name` is provided.
 * - `500 Internal Server Error` if AI fails to produce valid JSON or other errors occur.
 *
 * @example
 * // Request body
 * { "name": "Nike Air Zoom Pegasus 39" }
 *
 * // Example response
 * {
 *   "name": "Nike Air Zoom Pegasus 39",
 *   "isBranded": true,
 *   "description": "Lightweight running shoe built for speed and comfort.",
 *   "confidence": 0.87
 * }
 */

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }
    const basePrompt = `You are a strict JSON generator. Input: a product title string.

Task:
1) Determine whether the title is a branded product. If so, set "isBranded": true, If not, set "isBranded": false.
2) Provide a numeric confidence between 0 and 1 indicating how confident you are in brand detection.
3) Generate a concise product description (no more than 300 characters).


Return:
Only a single JSON object EXACTLY matching this schema. No extra commentary, no markdown, nothing else.

Schema example:
{
  "name": "Nike Air Zoom Pegasus 39",
  "isBranded": true,
  "description": "Lightweight running shoe built for speed and comfort, featuring responsive cushioning.",
  "confidence": 0.87,
}

Product title: "${name}".`;

    const { text } = await generateText({
      model: groq("compound-beta"),
      prompt: basePrompt,
    });

    const parsed = tryParseAndValidate(text);
    if (parsed.success) {
      return NextResponse.json(parsed.data);
    }

    const retryPrompt = `RETURN ONLY VALID JSON. NO text, no markdown. Reproduce a JSON object that matches the schema exactly. Input title: "${name}".`;
    const { text: retryText } = await generateText({
      model: groq("compound-beta"),
      prompt: retryPrompt,
    });

    const retryParsed = tryParseAndValidate(retryText);
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

function tryParseAndValidate(text: string) {
  try {
    const data = JSON.parse(text);
    const parsed = GeneratedProductDescriptionSchema.safeParse(data);
    if (parsed.success) {
      return { success: true, data: parsed.data };
    } else {
      return { success: false, errors: parsed.error };
    }
  } catch (e) {
    return { success: false, errors: e };
  }
}
