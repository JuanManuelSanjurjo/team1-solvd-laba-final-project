/**
 * __tests__/(side-bar)/my-products/add-product/add-product-page.test.tsx
 *
 * Instead of rendering the server-component into JSDOM (which triggers MUI's useTheme/useContext issues in this setup),
 * we call the async server component and inspect the returned React element tree directly.
 */

import React from "react";

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

function findInReactTree(
  node: any,
  predicate: (n: any) => boolean
): any | null {
  if (!node) return null;
  if (predicate(node)) return node;

  const children = node.props?.children ?? node.children;
  if (!children) return null;

  if (Array.isArray(children)) {
    for (const child of children) {
      const found = findInReactTree(child, predicate);
      if (found) return found;
    }
  } else {
    return findInReactTree(children, predicate);
  }
  return null;
}

it("calls fetchBrands, fetchColors, fetchSizes and returns an element containing AddProductForm and Save Button", async () => {
  // --- Arrange mocks & data ---
  const brands = [
    { value: 1, label: "Brand A" },
    { value: 2, label: "Brand B" },
  ];
  const colors = [
    { value: 10, label: "Red" },
    { value: 11, label: "Blue" },
  ];
  const sizes = [
    { value: 40, label: 40 },
    { value: 42, label: 42 },
  ];

  // Mock fetch modules
  jest.doMock("@/lib/strapi/fetchBrands", () => ({
    fetchBrands: jest.fn().mockResolvedValue(brands),
  }));
  jest.doMock("@/lib/strapi/fetchColors", () => ({
    fetchColors: jest.fn().mockResolvedValue(colors),
  }));
  jest.doMock("@/lib/strapi/fetchSizes", () => ({
    fetchSizes: jest.fn().mockResolvedValue(sizes),
  }));

  // Create mocks for AddProductForm and Button and keep references to the functions
  const AddProductFormMock = (props: any) => {
    // return a minimal element representation (we don't render it)
    return React.createElement("AddProductFormMock", props);
  };
  // module mock that exports named AddProductForm
  jest.doMock(
    "@/app/(side-bar)/my-products/add-product/components/AddProductForm",
    () => ({
      AddProductForm: AddProductFormMock,
    })
  );

  const ButtonMock = (props: any) =>
    React.createElement("button", props, props.children);
  jest.doMock("@/components/Button", () => ({
    __esModule: true,
    default: ButtonMock,
  }));

  // --- Act: import and call the server page component AFTER mocks are defined ---
  const pageModule = await import(
    "@/app/(side-bar)/my-products/add-product/page"
  );
  const Page = pageModule.default;
  const element = await Page(); // server component returns React element (not rendered)

  // --- Assert: fetch functions were called ---
  const { fetchBrands } = await import("@/lib/strapi/fetchBrands");
  const { fetchColors } = await import("@/lib/strapi/fetchColors");
  const { fetchSizes } = await import("@/lib/strapi/fetchSizes");

  expect(fetchBrands).toHaveBeenCalledTimes(1);
  expect(fetchColors).toHaveBeenCalledTimes(1);
  expect(fetchSizes).toHaveBeenCalledTimes(1);

  // --- Inspect the returned React element tree to find our AddProductFormMock ---
  const foundFormNode = findInReactTree(
    element,
    (n) => n?.type === AddProductFormMock
  );
  expect(foundFormNode).not.toBeNull();
  // its props should include the arrays we mocked
  expect(foundFormNode.props.brandOptions).toEqual(brands);
  expect(foundFormNode.props.colorOptions).toEqual(colors);
  expect(foundFormNode.props.sizeOptions).toEqual(sizes);

  // --- Also locate the ButtonMock node and check its props/children ---
  const foundButtonNode = findInReactTree(
    element,
    (n) =>
      n?.type === ButtonMock ||
      (typeof n.type === "string" && n.type === "button")
  );
  expect(foundButtonNode).not.toBeNull();
  // In the page JSX the Button is given form="add-product-form" and type="submit" and children "Save"
  expect(foundButtonNode.props.form).toBe("add-product-form");
  expect(foundButtonNode.props.type).toBe("submit");
  // children can be 'Save' or a React node that resolves to a string; check includes 'Save'
  const childrenText = foundButtonNode.props.children;
  // simple check:
  expect(String(childrenText)).toMatch(/save/i);
});
