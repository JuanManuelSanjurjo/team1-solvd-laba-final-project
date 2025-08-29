import { render, screen, fireEvent } from "@testing-library/react";
import PaginationComponent from "@/components/PaginationComponent";
import * as mui from "@mui/material";

jest.mock("@mui/material", () => {
  const actual = jest.requireActual("@mui/material");
  return {
    ...actual,
    useMediaQuery: jest.fn(),
  };
});

const { useMediaQuery } = mui;

describe("PaginationComponent", () => {
  const paginationMock = { pageCount: 5, page: 2, pageSize: 10, total: 50 };
  const setPageMock = jest.fn();

  beforeEach(() => setPageMock.mockClear());

  it("renders Pagination with correct active page", () => {
    (useMediaQuery as jest.Mock).mockReturnValue(false);
    render(
      <PaginationComponent pagination={paginationMock} setPage={setPageMock} />,
    );
    const activeButton = screen.getByRole("button", { current: "page" });
    expect(activeButton).toHaveTextContent("2");
  });

  it("calls setPage when clicking on a page button", () => {
    (useMediaQuery as jest.Mock).mockReturnValue(false);
    render(
      <PaginationComponent pagination={paginationMock} setPage={setPageMock} />,
    );
    const page3Button = screen.getByRole("button", { name: /Go to page 3/i });
    fireEvent.click(page3Button);
    expect(setPageMock).toHaveBeenCalledWith(3);
  });

  it("renders small size on mobile and medium on desktop", () => {
    (useMediaQuery as jest.Mock).mockReturnValue(true);
    const { rerender } = render(
      <PaginationComponent pagination={paginationMock} setPage={setPageMock} />,
    );

    let pageButton = screen.getByRole("button", { name: /Go to page 1/i });
    expect(pageButton).toHaveClass("MuiPaginationItem-sizeSmall");

    (useMediaQuery as jest.Mock).mockReturnValue(false);
    rerender(
      <PaginationComponent pagination={paginationMock} setPage={setPageMock} />,
    );
    pageButton = screen.getByRole("button", { name: /Go to page 1/i });
    expect(pageButton).toHaveClass("MuiPaginationItem-sizeMedium");
  });
});
