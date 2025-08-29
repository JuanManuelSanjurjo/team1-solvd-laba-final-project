import { GeneratedProductDescription } from "@/types/ai";

interface GenerateDescriptionProps {
  name: string;
  brand: string;
  category: string;
  color: string;
  gender: string;
  description: string;
}

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
 * @param {Object} body `{ name: string, brand: string, category: string, description: string, genre:string }`
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

export async function generateDescription({
  name,
  brand,
  category,
  color,
  gender,
  description,
}: GenerateDescriptionProps): Promise<GeneratedProductDescription> {
  console.log("generateDescription response:", {
    name,
    brand,
    category,
    color,
    gender,
    description,
  });
  const res = await fetch("/api/ia/generate-description", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, brand, category, color, gender, description }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "unknown" }));
    throw new Error(err?.error || "Failed to generate structured description");
  }
  const data = await res.json();
  return data as GeneratedProductDescription;
}
