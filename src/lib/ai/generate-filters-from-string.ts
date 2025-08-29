export type GenerateFiltersResponse = {
  redirectUrl: string;
  explain_short?: string;
};

/**
 * @function
 * @param {string} query - The query string to generate filters from.
 * @returns {Promise<GenerateFiltersResponse>} - A promise that resolves to an object containing the result of the operation.
 *
 * @example
 * const filters = await generateFiltersFromString("red shoes");
 * console.log(filters); // Output: { redirectUrl: "/products?color=red&category=shoes" }
 */
export async function generateFiltersFromString(
  query: string
): Promise<GenerateFiltersResponse> {
  if (!query || query.trim().length === 0) {
    throw new Error("Empty query");
  }

  const res = await fetch("/api/ia/generate-filters-from-string", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query),
  });

  const payload = await res.json().catch(() => null);

  if (!res.ok || !payload) {
    const message =
      payload?.error ?? `AI endpoint returned status ${res.status}`;
    throw new Error(message);
  }

  if (!payload.redirectUrl) {
    throw new Error("AI response missing redirectUrl");
  }

  return {
    redirectUrl: payload.redirectUrl,
    explain_short: payload.explain_short ?? "",
  };
}
