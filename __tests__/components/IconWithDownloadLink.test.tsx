import { render, screen } from "@testing-library/react";
import IconWithDownloadLink from "@/components/IconWithDownloadLink";

jest.mock("@mui/material/styles", () => {
  const actual = jest.requireActual("@mui/material/styles");
  return {
    ...actual,
    useTheme: () => ({
      palette: { cartTextColor: { primary: "#123456" } },
    }),
  };
});

jest.mock("iconsax-react", () => ({
  Document: (props: any) => <svg data-testid="Document" {...props} />,
}));

describe("IconWithDownloadLink", () => {
  it("renders the Document icon", () => {
    render(<IconWithDownloadLink />);
    const icon = screen.getByTestId("Document");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("size", "20");
    expect(icon).toHaveAttribute("color", "#CD3C37");
  });

  it("renders the download link with correct attributes and text", () => {
    render(<IconWithDownloadLink />);
    const link = screen.getByRole("link", { name: /PDF invoice download/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/files/manual.pdf");
    expect(link).toHaveAttribute("download");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("applies theme color to the Typography text", () => {
    render(<IconWithDownloadLink />);
    const text = screen.getByText(/PDF invoice download/i);
    expect(text).toHaveStyle("color: #123456");
    expect(text).toHaveStyle("font-size: 12px");
    expect(text).toHaveStyle("line-height: 16px");
  });
});
