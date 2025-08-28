import { Pagination } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { JSX } from "react";

type PaginationProps = {
  pagination: {
    pageCount: number;
    page: number;
    pageSize: number;
    total: number;
  };
  setPage: (page: number) => void;
};

/**
 * PaginationComponent component that represents the pagination of the products.
 *
 * @component
 * @param {PaginationProps} props - Props for the component
 * @param {Pagination} props.pagination - Pagination object that contains the page count, page, page size and total.
 * @param {function} props.setPage - Function that is called when the page is changed.
 * @returns {JSX.Element} The styled pagination component
 */
export default function PaginationComponent({
  pagination,
  setPage,
}: PaginationProps): JSX.Element {
  const isMobile = useMediaQuery("(max-width:600px)");
  return (
    <Pagination
      count={pagination?.pageCount || 1}
      page={pagination?.page || 0}
      color="primary"
      shape="rounded"
      size={isMobile ? "small" : "medium"}
      onChange={(event, value) => setPage(value)}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "50px",
        marginBottom: "100px",
      }}
    />
  );
}
