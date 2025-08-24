export function getLabelFromOptions(
  options: { label: string; value: number }[],
  value: number
): string {
  return options.find((opt) => opt.value === value)?.label ?? "";
}
