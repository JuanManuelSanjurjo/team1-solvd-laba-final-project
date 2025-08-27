/**
 * __tests__/AddProductForm.test.tsx
 *
 * Tests AddProductForm success / failure flows.
 *
 * NOTE: adjust import paths if your files live elsewhere.
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// mocks
const toastShowMock = jest.fn();
jest.mock("@/store/toastStore", () => ({
  useToastStore: {
    getState: () => ({ show: toastShowMock }),
  },
}));

// ---------------------------
// IMPORTANT FIX: mock useProductForm to return a REAL react-hook-form instance
// so `control` is valid for Controller usage.
// ---------------------------
jest.mock("@/app/(side-bar)/my-products/hooks/useProductForm", () => ({
  useProductForm: jest.fn(() => {
    // require here so hooks are resolved at runtime when the mock is called during render
    const { useForm } = require("react-hook-form");

    // provide default values similar to what the real hook would initialize
    const methods = useForm({
      defaultValues: {
        name: "Sneaker",
        color: 1,
        brand: 2,
        categories: 3,
        gender: 4,
        price: 100,
        description: "",
        sizes: [],
      },
    });

    return {
      // return the real methods so Controller and other form pieces work
      register: methods.register,
      control: methods.control,
      errors: {},
      selectedSizes: [],
      toggleSize: jest.fn(),
      // keep handleSubmit behavior so form submit triggers the passed handler with current values
      handleSubmit: (fn: any) => (e: any) => {
        e?.preventDefault?.();
        return fn(methods.getValues());
      },
      setValue: methods.setValue,
      getValues: methods.getValues,
      setError: methods.setError,
      reset: methods.reset,
    };
  }),
}));

// mock useImagePreviews
const previewsMock = {
  getNewFiles: jest.fn(() => []),
  getRemainingUrls: jest.fn(() => []),
  reset: jest.fn(),
  setImageFiles: jest.fn(),
  setExistentImages: jest.fn(),
};
jest.mock("@/app/(side-bar)/my-products/hooks/useImagePreviews", () => ({
  useImagePreviews: jest.fn(() => previewsMock),
}));

// mock the create hook used inside component
const mutateAsyncMock = jest.fn();
jest.mock(
  "@/app/(side-bar)/my-products/add-product/hooks/useCreateProduct",
  () => ({
    useCreateProduct: jest.fn(() => ({ mutateAsync: mutateAsyncMock })),
  })
);

// mock next router
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

// import the component under test (adjust path if needed)
import { AddProductForm } from "@/app/(side-bar)/my-products/add-product/components/AddProductForm";

describe("AddProductForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function renderWithProviders(ui: React.ReactElement) {
    // wrap in QueryClientProvider because component may rely on react-query context elsewhere
    const qc = new QueryClient();
    return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
  }

  const session = { user: { id: "123", jwt: "token-abc" } } as any;
  const defaultProps = {
    session,
    brandOptions: [{ value: 2, label: "ACME" }],
    colorOptions: [{ value: 1, label: "Red" }],
    sizeOptions: [{ value: 8, label: 8 }],
    categoryOptions: [{ value: 3, label: "Shoes" }],
  };

  test("calls create mutation, resets and navigates on success", async () => {
    mutateAsyncMock.mockResolvedValueOnce(undefined);

    renderWithProviders(<AddProductForm {...defaultProps} />);

    // form has id "add-product-form" in component
    const form = document.querySelector("#add-product-form")!;
    expect(form).toBeTruthy();

    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalled();
      expect(previewsMock.reset).toHaveBeenCalled();
      expect(pushMock).toHaveBeenCalledWith("/my-products");
    });
  });

  test("when create mutation fails, does not navigate", async () => {
    mutateAsyncMock.mockRejectedValueOnce(new Error("boom"));

    renderWithProviders(<AddProductForm {...defaultProps} />);

    const form = document.querySelector("#add-product-form")!;
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalled();
      // because mutation failed we should not have navigated
      expect(pushMock).not.toHaveBeenCalled();
    });
  });
});
