import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
//
const toastShowMock = jest.fn();
jest.mock("@/store/toastStore", () => ({
  useToastStore: {
    getState: () => ({ show: toastShowMock }),
  },
}));

jest.mock(
  "@/app/(side-bar)/my-products/add-product/components/ProductFormFields",
  () => ({
    ProductFormFields: () => null,
  })
);
jest.mock(
  "@/app/(side-bar)/my-products/add-product/components/ImagePreviewerUploader",
  () => ({
    __esModule: true,
    default: () => null,
  })
);

const previewsMock = {
  getNewFiles: jest.fn(() => [] as File[]),
  getRemainingUrls: jest.fn(() => ["https://img/1.jpg"]),
  reset: jest.fn(),
  setImageFiles: jest.fn(),
  setExistentImages: jest.fn(),
};
jest.mock("@/app/(side-bar)/my-products/hooks/useImagePreviews", () => ({
  useImagePreviews: jest.fn(() => previewsMock),
}));

const fakeFile = new File(["x"], "img.jpg", { type: "image/jpeg" });
jest.mock("@/lib/url-utils", () => ({
  urlToFile: jest.fn(() => Promise.resolve(fakeFile)),
}));

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

const useProductFormMock = jest.fn((initialDefaults?: any) => {
  const { useForm } = require("react-hook-form");
  const methods = useForm({
    defaultValues: {
      name: initialDefaults?.name ?? "",
      color: initialDefaults?.color ?? 0,
      gender: initialDefaults?.gender ?? 0,
      brand: initialDefaults?.brand ?? 0,
      price: initialDefaults?.price ?? 0,
      categories: initialDefaults?.categories ?? 0,
      description: initialDefaults?.description ?? "",
      sizes: initialDefaults?.sizes ?? [],
      userID: initialDefaults?.userID ?? 0,
      ...initialDefaults,
    },
  });

  return {
    register: methods.register,
    control: methods.control,
    errors: {},
    selectedSizes: initialDefaults?.sizes ?? [],
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
});
jest.mock("@/app/(side-bar)/my-products/hooks/useProductForm", () => ({
  useProductForm: (args?: any) => useProductFormMock(args),
}));

import { EditProductForm } from "@/app/(side-bar)/my-products/components/EditProductForm";

describe("EditProductForm (actual component)", () => {
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

  const renderWithProviders = (ui: React.ReactElement) => {
    const qc = new QueryClient();
    return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    previewsMock.getNewFiles.mockReturnValue([]);
    previewsMock.getRemainingUrls.mockReturnValue(["https://img/1.jpg"]);
  });

  test("duplicate mode: pre-fills (passes correct initial defaults to useProductForm)", () => {
    renderWithProviders(
      <EditProductForm
        session={session}
        brandOptions={[{ value: 2, label: "ACME" }]}
        colorOptions={[{ value: 1, label: "Red" }]}
        sizeOptions={[{ value: 8, label: 8 }]}
        categoryOptions={[{ value: 3, label: "Shoes" }]}
        product={sampleProduct}
        mode="duplicate"
        onSuccess={jest.fn()}
      />
    );

    expect(useProductFormMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Shoe",
        color: 1,
        gender: 4,
        brand: 2,
        price: 50,
        categories: 3,
        description: "desc",
        sizes: [8],
        userID: 0,
      })
    );
  });

  test("duplicate mode: saves by duplicating kept URLs into Files and calling create mutation with correct payload", async () => {
    createMutateAsync.mockResolvedValueOnce(undefined);

    renderWithProviders(
      <EditProductForm
        session={session}
        brandOptions={[{ value: 2, label: "ACME" }]}
        colorOptions={[{ value: 1, label: "Red" }]}
        sizeOptions={[{ value: 8, label: 8 }]}
        categoryOptions={[{ value: 3, label: "Shoes" }]}
        product={sampleProduct}
        mode="duplicate"
        onSuccess={jest.fn()}
      />
    );

    const form = document.querySelector("#edit-product-form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(
        (require("@/lib/url-utils").urlToFile as jest.Mock).mock.calls
      ).toEqual([["https://img/1.jpg"]]);

      expect(createMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: "Shoe",
            color: 1,
            gender: 4,
            brand: 2,
            categories: 3,
            price: 50,
            description: "desc",
            sizes: [8],
            userID: 5,
          }),
          imageFiles: expect.arrayContaining([fakeFile]),
          remainingExistentImages: [],
        })
      );
    });
  });

  test("edit mode: saves by calling update mutation with correct payload (existentImages & imagesToDelete)", async () => {
    updateMutateAsync.mockResolvedValueOnce(undefined);

    renderWithProviders(
      <EditProductForm
        session={session}
        brandOptions={[{ value: 2, label: "ACME" }]}
        colorOptions={[{ value: 1, label: "Red" }]}
        sizeOptions={[{ value: 8, label: 8 }]}
        categoryOptions={[{ value: 3, label: "Shoes" }]}
        product={sampleProduct}
        mode="edit"
        onSuccess={jest.fn()}
      />
    );

    const form = document.querySelector("#edit-product-form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(updateMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          productId: 99,
          data: expect.objectContaining({
            name: "Shoe",
            color: 1,
            gender: 4,
            brand: 2,
            categories: 3,
            price: 50,
            description: "desc",
            sizes: [8],
            userID: 5,
          }),
          imageFiles: [],
          existentImages: [10],
          imagesToDelete: [11],
        })
      );
    });
  });

  test("edit mode: shows toast on update failure", async () => {
    updateMutateAsync.mockRejectedValueOnce(new Error("fail update"));

    renderWithProviders(
      <EditProductForm
        session={session}
        brandOptions={[{ value: 2, label: "ACME" }]}
        colorOptions={[{ value: 1, label: "Red" }]}
        sizeOptions={[{ value: 8, label: 8 }]}
        categoryOptions={[{ value: 3, label: "Shoes" }]}
        product={sampleProduct}
        mode="edit"
        onSuccess={jest.fn()}
      />
    );

    const form = document.querySelector("#edit-product-form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(updateMutateAsync).toHaveBeenCalled();
      expect(toastShowMock).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: "error",
          message: "Failed to update product",
        })
      );
    });
  });
});
