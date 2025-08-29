/**
 * @function
 * @param {string} text - The text to be formatted.
 * @returns {string} - The formatted text with the first letter capitalized.
 *
 * @example
 * const formattedText = capitalizeFirstLetter("hello");
 * console.log(formattedText); // Output: "Hello"
 */
export function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getLabelFromOptions(
  options: { label: string; value: number }[],
  value: number
): string {
  return options.find((opt) => opt.value === value)?.label ?? "";
}
