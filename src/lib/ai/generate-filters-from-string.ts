/**
 * @typedef {Object} GenerateFiltersResponse
 * @property {string} redirectUrl - URL where the frontend should redirect after AI processing.
 * @property {string} [explain_short] - Optional short explanation returned by the AI.
 */
export type GenerateFiltersResponse = {
  redirectUrl: string;
  explain_short?: string;
};

/**
 * Sends the user's free-text query to the AI endpoint that generates filters/search
 * results and a redirect. Validates the minimal response shape and returns a typed
 * object with the redirect URL and optional explanation.
 *
 * Throws an Error when:
 *  - `query` is empty or only whitespace,
 *  - the network response is not ok,
 *  - the payload cannot be parsed as JSON,
 *  - or the returned payload does not contain a `redirectUrl`.
 *
 * @param {string} query - Free-text search/query used to ask the AI to generate filters.
 * @returns {Promise<GenerateFiltersResponse>} Resolves with the AI response object.
 *
 * @throws {Error} If query is empty or the API returns an error / invalid payload.
 *
 * @example
 * const resp = await generateFiltersFromString("red running shoes under $100");
 * // resp.redirectUrl -> string
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
