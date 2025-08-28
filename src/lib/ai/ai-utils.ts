import z from "zod";

/**
 * Returns the label for an option list by its numeric value, or an empty string when not found.
 *
 * @param {{label: string; value: number}[]} options - List of option objects.
 * @param {number} value - The value to search for.
 * @returns {string} The matching label or an empty string.
 *
 * @example
 * getLabelFromOptions([{label: 'Small', value: 1}], 1) // -> 'Small'
 */
export function getLabelFromOptions(
  options: { label: string; value: number }[],
  value: number
): string {
  return options.find((opt) => opt.value === value)?.label ?? "";
}

/**
 * Tries to parse a JSON string and validate it with a Zod schema.
 *
 * - If JSON.parse fails or zod validation fails, returns `{ success: false, errors }`.
 * - If both succeed, returns `{ success: true, data }`.
 *
 * Generic helper used to validate incoming JSON strings robustly.
 *
 * @template T
 * @param {string} text - JSON string to parse.
 * @param {z.ZodSchema<T>} schema - Zod schema to validate the parsed JSON.
 * @returns {{ success: true; data: T } | { success: false; errors: unknown }} Result object indicating success and parsed data or failure and errors.
 *
 * @example
 * const schema = z.object({ id: z.number() });
 * tryParseAndValidate('{"id":1}', schema) // -> { success: true, data: { id: 1 } }
 */
export function tryParseAndValidate<T>(
  text: string,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; errors: unknown } {
  try {
    const json = JSON.parse(text);
    const result = schema.safeParse(json);

    if (!result.success) {
      return { success: false, errors: result.error };
    }

    return { success: true, data: result.data };
  } catch (e) {
    return { success: false, errors: e };
  }
}
