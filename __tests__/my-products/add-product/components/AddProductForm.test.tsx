import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";

const toastShowMock = jest.fn();
jest.mock("@/store/toastStore", () => ({
  useToastStore: {
    getState: () => ({ show: toastShowMock }),
  },
}));

jest.mock("@/app/(side-bar)/my-products/hooks/useProductForm", () => ({
  useProductForm: jest.fn(() => {
    const { useForm } = require("react-hook-form");

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
      register: methods.register,
      control: methods.control,
      errors: {},
      selectedSizes: [],
      toggleSize: jest.fn(),

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

const mutateAsyncMock = jest.fn();
jest.mock(
  "@/app/(side-bar)/my-products/add-product/hooks/useCreateProduct",
  () => ({
    useCreateProduct: jest.fn(() => ({ mutateAsync: mutateAsyncMock })),
  }),
);

const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

import { AddProductForm } from "@/app/(side-bar)/my-products/add-product/components/AddProductForm";

describe("AddProductForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

    render(<AddProductForm {...defaultProps} />);

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

    render(<AddProductForm {...defaultProps} />);

    const form = document.querySelector("#add-product-form")!;
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalled();
      expect(pushMock).not.toHaveBeenCalled();
    });
  });
});
