// __tests__/hooks/useImagePreviews.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useImagePreviews } from "@/app/(side-bar)/my-products/hooks/useImagePreviews";

function TestComponent({ initialUrls = [] }: { initialUrls?: string[] }) {
  const previews = useImagePreviews(initialUrls);
  return (
    <div>
      <button
        data-testid="add-file"
        onClick={() =>
          previews.setImageFiles([
            new File(["blob"], "a.png", { type: "image/png" }),
          ])
        }
      >
        add file
      </button>

      <button
        data-testid="set-existent"
        onClick={() => previews.setExistentImages(["u1"])}
      >
        set existent
      </button>

      <button data-testid="reset" onClick={() => previews.reset()}>
        reset
      </button>

      <div data-testid="new-files-count">{previews.getNewFiles().length}</div>
      <div data-testid="remaining-urls-count">
        {previews.getRemainingUrls().length}
      </div>
    </div>
  );
}

describe("useImagePreviews", () => {
  test("initialUrls are used, set/get/reset works", () => {
    render(<TestComponent initialUrls={["one", "two"]} />);

    expect(screen.getByTestId("new-files-count").textContent).toBe("0");
    expect(screen.getByTestId("remaining-urls-count").textContent).toBe("2");

    fireEvent.click(screen.getByTestId("add-file"));
    expect(screen.getByTestId("new-files-count").textContent).toBe("1");

    fireEvent.click(screen.getByTestId("set-existent"));
    expect(screen.getByTestId("remaining-urls-count").textContent).toBe("1");

    fireEvent.click(screen.getByTestId("reset"));
    expect(screen.getByTestId("new-files-count").textContent).toBe("0");
    expect(screen.getByTestId("remaining-urls-count").textContent).toBe("0");
  });
});
