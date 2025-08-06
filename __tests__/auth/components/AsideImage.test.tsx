import "@testing-library/jest-dom";
import { render, screen } from "../../utils/test-utils";
import AsideImage from "@/app/auth/components/AsideImage";

jest.mock("next/image", () => {
  return function MockImage({ src, alt, fill, ...props }: any) {
    const { fill: _, ...domProps } = { fill, ...props };
    return <img src={src} alt={alt} data-testid="aside-image" {...domProps} />;
  };
});

describe("AsideImage Component", () => {
  const defaultProps = {
    imageUrl: "/test-image.jpg",
    alt: "Test image description",
  };

  it("renders with correct image props", () => {
    render(<AsideImage {...defaultProps} />);

    const image = screen.getByTestId("aside-image");
    expect(image).toHaveAttribute("src", "/test-image.jpg");
    expect(image).toHaveAttribute("alt", "Test image description");
  });

  it("renders children when provided", () => {
    render(
      <AsideImage {...defaultProps}>
        <div data-testid="test-content">Test Content</div>
      </AsideImage>
    );

    expect(screen.getByTestId("test-content")).toBeInTheDocument();
  });
});
