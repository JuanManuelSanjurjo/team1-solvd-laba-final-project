/**
 * Represents the available filters
 */
import { ProductFilters } from "@/types/product";
import { getQueryStringFromFilters } from "@/lib/get-query-string-from-filters";

/**
 * Fetches products from the Strapi API based on provided filter criteria.
 *
 * Constructs a query string with the given filters and sends a GET request
 * to the `/api/products` endpoint. Each filter is appended according to Strapi's
 * filtering conventions.
 *
 * Supported filters:
 * - `brands`, `sizes`, `genders`, `colors`, `categories`: Filter by matching names or values.
 * - `priceMin` and `priceMax`: Filters products whose price falls within the specified range.
 *
 * @param {ProductFilters} filters - An object containing optional product filter criteria.
 * @returns {Promise<any[]>} - A promise that resolves to an array of filtered product data from the API.
 * @throws {Error} - Throws an error if the network response is not OK.
 */

export async function fetchProducts(
  filters: ProductFilters,
  pageNumber: number,
  pageSize: number,
  searchTerm: string | null,
  searchFields: string[] = ["name"],
  populateFields: string[] = []
) {
  const baseUrl = searchTerm
    ? new URL(
        getQueryStringFromFilters(searchTerm, searchFields, populateFields)
      )
    : new URL(`${process.env.NEXT_PUBLIC_API_URL}/products`);

  baseUrl.searchParams.set("populate", "*");
  baseUrl.searchParams.set("pagination[page]", pageNumber.toString());
  baseUrl.searchParams.set("pagination[pageSize]", pageSize.toString());

  if (filters.brands) {
    filters.brands.forEach((brand, index) => {
      baseUrl.searchParams.append(`filters[brand][name][$in][${index}]`, brand);
    });
  }

  if (filters.sizes) {
    filters.sizes.forEach((size, index) => {
      baseUrl.searchParams.append(`filters[sizes][value][$in][${index}]`, size);
    });
  }

  if (filters.genders) {
    filters.genders.forEach((gender, index) => {
      baseUrl.searchParams.append(
        `filters[gender][name][$in][${index}]`,
        gender
      );
    });
  }

  if (filters.categories) {
    filters.categories.forEach((categorie, index) => {
      baseUrl.searchParams.append(
        `filters[categories][name][$in][${index}]`,
        categorie
      );
    });
  }

  if (filters.colors) {
    filters.colors.forEach((color, index) => {
      baseUrl.searchParams.append(`filters[color][name][$in][${index}]`, color);
    });
  }

  if (filters.priceMin !== undefined && filters.priceMax !== undefined) {
    baseUrl.searchParams.append(
      "filters[price][$between]",
      filters.priceMin.toString()
    );
    baseUrl.searchParams.append(
      "filters[price][$between]",
      filters.priceMax.toString()
    );
  }
  console.log(baseUrl);
  //baseUrl.searchParams.append(`filters[teamName][$in]`, "team-1");

  const response = await fetch(baseUrl.toString());
  if (!response.ok) throw new Error("Network response was not ok");
  const json = await response.json();
  return json;
}
