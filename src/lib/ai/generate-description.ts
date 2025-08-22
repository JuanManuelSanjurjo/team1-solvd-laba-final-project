import { GeneratedProductDescription } from "@/types/ai";

/**
 * Generates a structured product description using the AI endpoint.
 *
 * Sends a POST request to `/api/ia/generate-description` with the product `name`,
 * and expects a JSON response matching the `GeneratedProductDescription` schema:
 *
 * - `name`: the product title.
 * - `isBranded`: boolean indicating if the product is branded.
 * - `description`: concise product description.
 * - `confidence`: numeric confidence score (0–1) for brand detection.
 *
 * @async
 * @function generateDescription
 * @param {string} name - The product name for which to generate the description.
 * @returns {Promise<GeneratedProductDescription>} The structured product description returned by the AI.
 * @throws {Error} If the API response is not OK or the JSON cannot be parsed.
 *
 * @example
 * const description = await generateDescription("Nike Air Zoom Pegasus 39");
 * console.log(description);
 * // {
 * //   name: "Nike Air Zoom Pegasus 39",
 * //   isBranded: true,
 * //   description: "Lightweight running shoe built for speed and comfort.",
 * //   confidence: 0.87
 * // }
 */

export async function generateDescription(
  name: string
): Promise<GeneratedProductDescription> {
  const res = await fetch("/api/ia/generate-description", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "unknown" }));
    throw new Error(err?.error || "Failed to generate structured description");
  }
  const data = await res.json();
  return data as GeneratedProductDescription;
}
