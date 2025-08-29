import { getLabelFromOptions } from "@/lib/ai/ai-utils";

describe("getLabelFromOptions", () => {
  const options = [
    { label: "Small", value: 1 },
    { label: "Medium", value: 2 },
    { label: "Large", value: 3 },
  ];

  it("returns the correct label for a matching value", () => {
    expect(getLabelFromOptions(options, 2)).toBe("Medium");
    expect(getLabelFromOptions(options, 3)).toBe("Large");
  });

  it("returns an empty string if value is not found", () => {
    expect(getLabelFromOptions(options, 999)).toBe("");
  });

  it("returns an empty string if options array is empty", () => {
    expect(getLabelFromOptions([], 1)).toBe("");
  });
});
