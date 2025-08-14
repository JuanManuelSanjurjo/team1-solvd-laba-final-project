/**
 * __tests__/ProductFormFields.test.tsx
 *
 * Updated to query hidden native checkbox inputs instead of relying on getAllByRole('checkbox')
 */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { ProductFormData } from "@/app/(side-bar)/my-products/add-product/schema";
import { ProductFormFields } from "@/app/(side-bar)/my-products/add-product/components/ProductFormFields";

type TestWrapperProps = {
  colorOptions?: { value: number; label: string }[];
  brandOptions?: { value: number; label: string }[];
  sizeOptions?: { value: number; label: number }[];
  errors?: any;
};

function TestWrapper({
  colorOptions = [{ value: 1, label: "White" }],
  brandOptions = [{ value: 2, label: "Brand A" }],
  sizeOptions = [
    { value: 40, label: 40 },
    { value: 42, label: 42 },
  ],
  errors = {},
}: TestWrapperProps) {
  const methods = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      color: colorOptions[0].value,
      gender: 4,
      brand: brandOptions[0].value,
      price: 0,
      description: "",
      sizes: [],
      userID: 0,
    },
  });

  const { register, control, watch } = methods;
  const selectedSizes = watch("sizes") || [];

  const toggleSize = (size: number) => {
    const current: number[] = methods.getValues("sizes") || [];
    const newSizes = current.includes(size)
      ? current.filter((s) => s !== size)
      : [...current, size];
    methods.setValue("sizes", newSizes);
  };

  return (
    <form>
      <ProductFormFields
        register={register}
        control={control}
        errors={errors}
        colorOptions={colorOptions}
        brandOptions={brandOptions}
        sizeOptions={sizeOptions}
        selectedSizes={selectedSizes}
        toggleSize={toggleSize}
      />
    </form>
  );
}

describe("ProductFormFields", () => {
  it("binds inputs to react-hook-form via register", async () => {
    render(<TestWrapper />);

    const user = userEvent.setup();
    const nameInput = screen.getByLabelText(
      /Product name/i
    ) as HTMLInputElement;
    const priceInput = screen.getByLabelText(/Price/i) as HTMLInputElement;
    const descriptionInput = screen.getByLabelText(
      /Description/i
    ) as HTMLInputElement;

    await user.type(nameInput, "Test name");
    await user.clear(priceInput);
    await user.type(priceInput, "55");
    await user.type(descriptionInput, "My description");

    expect(nameInput).toHaveValue("Test name");
    expect(priceInput).toHaveValue(55);
    expect(descriptionInput).toHaveValue("My description");
  });

  it("toggles size when clicking ShoeSizeOption (checks hidden native checkbox)", async () => {
    const user = userEvent.setup();
    const { container } = render(<TestWrapper />);

    // Click the visible box with text "EU-42"
    const size42 = screen.getByText("EU-42");
    expect(size42).toBeInTheDocument();
    await user.click(size42);

    // Wait for any asynchronous updates
    await waitFor(() => {
      // Query native checkbox inputs (MUI renders a hidden input)
      const checkboxInputs = container.querySelectorAll(
        'input[type="checkbox"]'
      );

      // Helpful failure message if none are found
      if (checkboxInputs.length === 0) {
        throw new Error(
          "No checkbox inputs found. The ShoeSizeOption renders a hidden native checkbox input; ensure MUI is rendering the input in the test environment."
        );
      }

      // At least one native checkbox input should be checked after clicking the size box
      const anyChecked = Array.from(checkboxInputs).some(
        (el) => (el as HTMLInputElement).checked
      );
      expect(anyChecked).toBe(true);
    });
  });

  it("shows helper text when sizes error exists", () => {
    const errors = { sizes: { message: "Choose at least one size" } };
    render(<TestWrapper errors={errors} />);
    expect(screen.getByText(/Choose at least one size/i)).toBeInTheDocument();
  });
});
