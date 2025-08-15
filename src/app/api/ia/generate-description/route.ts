import { NextResponse } from "next/server";
import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

/**
 * API route handler for generating a product description using the Groq model.
 *
 * @param {Request} req - The incoming HTTP request object. Expects a JSON body with a `name` field.
 *
 * @returns {Promise<NextResponse>} A JSON response containing either:
 * - `{ description: string }` if the product description was successfully generated, or
 * - `{ error: string }` with an appropriate HTTP status code if an error occurred.
 *
 * @throws {Error} Logs errors to the server console if text generation fails.
 *
 * @example
 * // Request
 * fetch("/api/generate-description", {
 *   method: "POST",
 *   body: JSON.stringify({ name: "Running Shoes" }),
 * });
 *
 * // Successful Response (200)
 * { "description": "Lightweight running shoes built for comfort and speed." }
 *
 * // Error Response (400)
 * { "error": "Product name is required" }
 *
 * // Error Response (500)
 * { "error": "Error generating description" }
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

    const { text } = await generateText({
      model: groq("compound-beta"),
      prompt: `Write a concise, engaging product description (NO MORE THAN 300 CHARACTERS) for "${name}".`,
    });

    return NextResponse.json({ description: text });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error generating description" },
      { status: 500 }
    );
  }
}
