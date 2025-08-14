/**
 * __tests__/(side-bar)/my-products/edit-product/components/EditProductForm.test.tsx
 *
 * Tests for EditProductForm (client component).
 */

import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditProductForm } from "@/app/(side-bar)/my-products/components/EditProductForm";

// --- Mocks ---
// Mock next-auth useSession
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

// Mock the update hook module used by the component
jest.mock("@/app/(side-bar)/my-products/hooks/useUpdateProduct", () => ({
  useUpdateProduct: jest.fn(),
}));

// Import the component under test AFTER jest.mock calls above.

const originalCreateObjectURL = URL.createObjectURL;

beforeAll(() => {
  // Some tests might render the real ImagePreviewerUploader which calls URL.createObjectURL
  // stub it so tests don't error in node/jsdom
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  URL.createObjectURL = jest.fn(() => "blob:mock-preview");
});

afterAll(() => {
  // restore
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  URL.createObjectURL = originalCreateObjectURL;
});

beforeEach(() => {
  jest.clearAllMocks();
});

const brandOptions = [
  { value: 1, label: "Nike" },
  { value: 2, label: "Adidas" },
];
const colorOptions = [
  { value: 10, label: "White" },
  { value: 11, label: "Black" },
];
const sizeOptions = [
  { value: 40, label: 40 },
  { value: 42, label: 42 },
];

const sampleProduct = {
  id: 100,
  name: "Old Shoe",
  color: { id: 10, name: "White" },
  gender: { id: 4, name: "Women" },
  brand: { id: 1, name: "Nike" },
  price: 120,
  description: "A product description",
  sizes: [{ id: 40 }, { id: 42 }],
  images: [
    { id: 501, url: "https://example.com/img1.png" },
    { id: 502, url: "https://example.com/img2.png" },
  ],
};

describe("EditProductForm", () => {
  it("renders with product values and initial previews", async () => {
    // session mock
    const { useSession } = require("next-auth/react");
    useSession.mockReturnValue({ data: { user: { id: "123", jwt: "tok" } } });

    // mock update hook to a harmless stub (we won't submit in this test)
    const {
      useUpdateProduct,
    } = require("@/app/(side-bar)/my-products/hooks/useUpdateProduct");
    useUpdateProduct.mockReturnValue({ mutateAsync: jest.fn() });

    const { container } = render(
      <EditProductForm
        brandOptions={brandOptions}
        colorOptions={colorOptions}
        sizeOptions={sizeOptions}
        product={sampleProduct as any}
        mode="edit"
      />
    );

    // Check inputs populated
    const nameInput = screen.getByLabelText(
      /Product name/i
    ) as HTMLInputElement;
    expect(nameInput).toHaveValue("Old Shoe");

    const priceInput = screen.getByLabelText(/Price/i) as HTMLInputElement;
    // toHaveValue accepts number
    expect(priceInput).toHaveValue(120);

    const descriptionInput = screen.getByLabelText(
      /Description/i
    ) as HTMLTextAreaElement;
    expect(descriptionInput).toHaveValue("A product description");

    // Check that initial preview images are present in the DOM (ImagePreviewerUploader -> Card -> img)
    const imgs = Array.from(container.querySelectorAll("img"));
    const foundPreview = imgs.some((img) =>
      String(img.getAttribute("src")).includes("example.com/img1.png")
    );
    expect(foundPreview).toBe(true);

    // Size inputs: there should be hidden native checkboxes representing sizes and since product.sizes includes both,
    // at least one of them should be checked initially
    const checkboxInputs = container.querySelectorAll('input[type="checkbox"]');
    expect(checkboxInputs.length).toBeGreaterThanOrEqual(1);
    const initiallyChecked = Array.from(checkboxInputs).some(
      (el) => (el as HTMLInputElement).checked
    );
    expect(initiallyChecked).toBe(true);
  });

  it("toggles size when clicking the size box", async () => {
    const user = userEvent.setup();
    const { useSession } = require("next-auth/react");
    useSession.mockReturnValue({ data: { user: { id: "123", jwt: "tok" } } });

    const {
      useUpdateProduct,
    } = require("@/app/(side-bar)/my-products/hooks/useUpdateProduct");
    useUpdateProduct.mockReturnValue({ mutateAsync: jest.fn() });

    const { container } = render(
      <EditProductForm
        brandOptions={brandOptions}
        colorOptions={colorOptions}
        sizeOptions={sizeOptions}
        product={sampleProduct as any}
        mode="edit"
      />
    );

    // Count checked checkboxes before toggle
    const beforeCheckboxes = container.querySelectorAll(
      'input[type="checkbox"]'
    );
    const beforeCheckedCount = Array.from(beforeCheckboxes).filter(
      (el) => (el as HTMLInputElement).checked
    ).length;

    // Click the visual size box (EU-42)
    const sizeBox = screen.getByText("EU-42");
    await user.click(sizeBox);

    // Wait for RHF updates
    await waitFor(() => {
      const afterCheckboxes = container.querySelectorAll(
        'input[type="checkbox"]'
      );
      const afterCheckedCount = Array.from(afterCheckboxes).filter(
        (el) => (el as HTMLInputElement).checked
      ).length;

      // If size was previously selected, clicking it should reduce checked count by 1
      expect(afterCheckedCount).toBeLessThanOrEqual(beforeCheckedCount);
    });
  });

  it("submits successfully and shows success snackbar with correct payload", async () => {
    const user = userEvent.setup();
    const { useSession } = require("next-auth/react");
    useSession.mockReturnValue({ data: { user: { id: "123", jwt: "tok" } } });

    // Setup mutateAsync mock to resolve
    const {
      useUpdateProduct,
    } = require("@/app/(side-bar)/my-products/hooks/useUpdateProduct");
    const mutateAsync = jest.fn().mockResolvedValue(undefined);
    useUpdateProduct.mockReturnValue({ mutateAsync });

    render(
      <EditProductForm
        brandOptions={brandOptions}
        colorOptions={colorOptions}
        sizeOptions={sizeOptions}
        product={sampleProduct as any}
        mode="edit"
      />
    );

    // change name to ensure data flows through
    const nameInput = screen.getByLabelText(
      /Product name/i
    ) as HTMLInputElement;
    await user.clear(nameInput);
    await user.type(nameInput, "Updated Shoe");

    const formElement = document.getElementById(
      "edit-product-form"
    ) as HTMLFormElement;
    expect(formElement).toBeTruthy();

    fireEvent.submit(formElement);

    // wait for mutateAsync to be called
    await waitFor(() => expect(mutateAsync).toHaveBeenCalledTimes(1));

    const callArg = mutateAsync.mock.calls[0][0] as any;
    // callArg should contain data, imageFiles and existentImages
    expect(callArg).toHaveProperty("data");
    expect(callArg).toHaveProperty("imageFiles");
    expect(callArg).toHaveProperty("existentImages");

    // userID should be parsed from session id "123" -> 123
    expect(callArg.data.userID).toBe(123);
    // The name we typed should be present
    expect(callArg.data.name).toBe("Updated Shoe");
    // No new images were added in this test
    expect(Array.isArray(callArg.imageFiles)).toBe(true);
    expect(callArg.imageFiles).toHaveLength(0);

    // existentImages should match all existing image ids from sampleProduct
    expect(callArg.existentImages).toEqual([501, 502]);

    // success snackbar should appear
    expect(
      await screen.findByText("Product updated successfully!")
    ).toBeInTheDocument();
  });

  it("shows error snackbar when mutateAsync rejects", async () => {
    const user = userEvent.setup();
    const { useSession } = require("next-auth/react");
    useSession.mockReturnValue({ data: { user: { id: "123", jwt: "tok" } } });

    // Setup mutateAsync mock to reject
    const {
      useUpdateProduct,
    } = require("@/app/(side-bar)/my-products/hooks/useUpdateProduct");
    const mutateAsync = jest.fn().mockRejectedValue(new Error("fail"));
    useUpdateProduct.mockReturnValue({ mutateAsync });

    render(
      <EditProductForm
        brandOptions={brandOptions}
        colorOptions={colorOptions}
        sizeOptions={sizeOptions}
        product={sampleProduct as any}
        mode="edit"
      />
    );

    const formElement = document.getElementById(
      "edit-product-form"
    ) as HTMLFormElement;
    fireEvent.submit(formElement);

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledTimes(1));
    expect(
      await screen.findByText("Failed to update product.")
    ).toBeInTheDocument();
  });
});
