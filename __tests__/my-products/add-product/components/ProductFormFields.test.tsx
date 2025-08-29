import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useForm } from "react-hook-form";

jest.mock("@/components/form-elements/Input", () => ({
  __esModule: true,
  default: (props: any) => (
    <input data-testid={`input-${props.name}`} {...props} />
  ),
}));

jest.mock("@/components/form-elements/Select", () => ({
  __esModule: true,
  default: (props: any) => (
    <select
      data-testid={`select-${props.name}`}
      value={props.value}
      onChange={(e) => props.onChange?.(e.target.value)}
    >
      {(props.options || []).map((o: any) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  ),
}));

jest.mock("@/app/products/[product-id]/components/ShoeSizeOption", () => ({
  __esModule: true,
  default: ({ value, checked, onToggle }: any) => (
    <button
      data-testid={`size-${value}`}
      aria-pressed={checked}
      onClick={() => onToggle(value)}
    >
      {value}
    </button>
  ),
}));

jest.mock("@/components/AiButton", () => ({
  __esModule: true,
  default: ({ onGenerate, isLoading, label }: any) => (
    <button data-testid="ai-button" onClick={onGenerate} disabled={isLoading}>
      {label || "AI"}
    </button>
  ),
}));

const toastShowMock = jest.fn();
jest.mock("@/store/toastStore", () => ({
  useToastStore: {
    getState: () => ({ show: toastShowMock }),
  },
}));

const generateDescriptionMock = jest.fn();
jest.mock("@/lib/ai/generate-description", () => ({
  generateDescription: (...args: any[]) => generateDescriptionMock(...args),
}));

jest.mock("@/lib/ai/ai-utils", () => ({
  getLabelFromOptions: (options: any[], value: any) =>
    options?.find((o) => o.value === value)?.label ?? "",
}));

import { ProductFormFields } from "@/app/(side-bar)/my-products/add-product/components/ProductFormFields";

const defaultOptions = {
  colorOptions: [{ value: 1, label: "Red" }],
  brandOptions: [{ value: 2, label: "ACME" }],
  sizeOptions: [{ value: 8, label: 8 }],
  categoryOptions: [{ value: 3, label: "Shoes" }],
  selectedSizes: [],
  toggleSize: jest.fn(),
};

function renderWithForm(overrides: Partial<any> = {}) {
  const Wrapper = () => {
    const methods = useForm({
      defaultValues: {
        name: "Sneaker",
        brand: 2,
        categories: 3,
        color: 1,
        gender: 3,
        description: "",
      },
    });

    const props = {
      register: methods.register,
      control: methods.control,
      errors: {},
      colorOptions: defaultOptions.colorOptions,
      brandOptions: defaultOptions.brandOptions,
      sizeOptions: defaultOptions.sizeOptions,
      categoryOptions: defaultOptions.categoryOptions,
      selectedSizes: defaultOptions.selectedSizes,
      toggleSize: defaultOptions.toggleSize,
      getValues: methods.getValues,
      setValue: methods.setValue,
      setError: methods.setError,
      ...overrides,
    };

    return <ProductFormFields {...(props as any)} />;
  };

  return render(<Wrapper />);
}

describe("ProductFormFields - handleGenerate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows error toast when AI says isBranded === false", async () => {
    generateDescriptionMock.mockResolvedValueOnce({ isBranded: false });

    renderWithForm();

    fireEvent.click(screen.getByTestId("ai-button"));

    await waitFor(() =>
      expect(toastShowMock).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: "error",
          message:
            "AI detected this product name is likely not branded. Please review the product name.",
        })
      )
    );
  });

  test("shows low-confidence toast when confidence < threshold", async () => {
    generateDescriptionMock.mockResolvedValueOnce({
      isBranded: true,
      confidence: 0.3,
    });

    renderWithForm();

    fireEvent.click(screen.getByTestId("ai-button"));

    await waitFor(() =>
      expect(toastShowMock).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: "error",
          message: expect.stringContaining("AI is uncertain about branding"),
        })
      )
    );
  });

  test("sets description and shows success toast on success", async () => {
    generateDescriptionMock.mockResolvedValueOnce({
      isBranded: true,
      confidence: 0.9,
      description: "Great shoe description",
    });

    const setValueSpy = jest.fn();
    renderWithForm({ setValue: setValueSpy });

    fireEvent.click(screen.getByTestId("ai-button"));

    await waitFor(() => {
      expect(setValueSpy).toHaveBeenCalledWith(
        "description",
        "Great shoe description"
      );
      expect(toastShowMock).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: "success",
          message: "Description generated succesfully",
        })
      );
    });
  });
});
