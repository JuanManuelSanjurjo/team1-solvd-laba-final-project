/**
 * __tests__/EditProductForm.test.tsx
 *
 * Tests EditProductForm in "edit" and "duplicate" modes.
 *
 * NOTE: adjust import paths if your files live elsewhere.
 */

import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// toast mock
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

// mock previews
const previewsMock = {
  getNewFiles: jest.fn(() => []),
  getRemainingUrls: jest.fn(() => ["https://img/1.jpg"]),
  reset: jest.fn(),
  setImageFiles: jest.fn(),
  setExistentImages: jest.fn(),
};
jest.mock("@/app/(side-bar)/my-products/hooks/useImagePreviews", () => ({
  useImagePreviews: jest.fn(() => previewsMock),
}));

// mock create and update hooks
const createMutateAsync = jest.fn();
const updateMutateAsync = jest.fn();
jest.mock(
  "@/app/(side-bar)/my-products/add-product/hooks/useCreateProduct",
  () => ({
    useCreateProduct: jest.fn(() => ({ mutateAsync: createMutateAsync })),
  })
);
jest.mock("@/app/(side-bar)/my-products/hooks/useUpdateProduct", () => ({
  useUpdateProduct: jest.fn(() => ({ mutateAsync: updateMutateAsync })),
}));

// mock urlToFile used in duplicate flow
const fakeFile = new File(["x"], "img.jpg", { type: "image/jpeg" });
jest.mock("@/lib/url-utils", () => ({
  urlToFile: jest.fn(() => Promise.resolve(fakeFile)),
}));

// import component under test (adjust path as required)
import { EditProductForm } from "@/app/(side-bar)/my-products/components/EditProductForm";

describe("EditProductForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function renderWithProviders(ui: React.ReactElement) {
    const qc = new QueryClient();
    return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
  }

  const session = { user: { id: "5", jwt: "token" } } as any;

  const sampleProduct = {
    id: 99,
    name: "Shoe",
    color: { id: 1 },
    gender: { id: 4 },
    brand: { id: 2 },
    price: 50,
    description: "desc",
    images: [
      { id: 10, url: "https://img/1.jpg" },
      { id: 11, url: "https://img/2.jpg" },
    ],
    categories: [{ id: 3 }],
    sizes: [{ id: 8 }],
  } as any;

  test("edit mode: calls update mutation and onSuccess", async () => {
    updateMutateAsync.mockResolvedValueOnce(undefined);

    const onSuccess = jest.fn();

    renderWithProviders(
      <EditProductForm
        session={session}
        brandOptions={[{ value: 2, label: "ACME" }]}
        colorOptions={[{ value: 1, label: "Red" }]}
        sizeOptions={[{ value: 8, label: 8 }]}
        categoryOptions={[{ value: 3, label: "Shoes" }]}
        product={sampleProduct}
        mode="edit"
        onSuccess={onSuccess}
      />
    );

    const form = document.querySelector("#edit-product-form")!;
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(updateMutateAsync).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  test("duplicate mode: calls create mutation with duplicated files and onSuccess", async () => {
    createMutateAsync.mockResolvedValueOnce(undefined);

    const onSuccess = jest.fn();

    renderWithProviders(
      <EditProductForm
        session={session}
        brandOptions={[{ value: 2, label: "ACME" }]}
        colorOptions={[{ value: 1, label: "Red" }]}
        sizeOptions={[{ value: 8, label: 8 }]}
        categoryOptions={[{ value: 3, label: "Shoes" }]}
        product={sampleProduct}
        mode="duplicate"
        onSuccess={onSuccess}
      />
    );

    const form = document.querySelector("#edit-product-form")!;
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(
        require("@/lib/url-utils").urlToFile as jest.Mock
      ).toHaveBeenCalled();
      expect(createMutateAsync).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  test("edit mode: shows toast on update failure", async () => {
    updateMutateAsync.mockRejectedValueOnce(new Error("fail update"));

    const onSuccess = jest.fn();

    renderWithProviders(
      <EditProductForm
        session={session}
        brandOptions={[{ value: 2, label: "ACME" }]}
        colorOptions={[{ value: 1, label: "Red" }]}
        sizeOptions={[{ value: 8, label: 8 }]}
        categoryOptions={[{ value: 3, label: "Shoes" }]}
        product={sampleProduct}
        mode="edit"
        onSuccess={onSuccess}
      />
    );

    const form = document.querySelector("#edit-product-form")!;
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(updateMutateAsync).toHaveBeenCalled();
      expect(toastShowMock).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: "error",
          message: "Failed to update product",
        })
      );
      // onSuccess should not be called
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });
});
