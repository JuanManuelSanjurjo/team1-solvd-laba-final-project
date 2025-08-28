"use client";
import { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Custom hook for handling product search in "My Products" page.
 *
 * Syncs the search term with the URL query parameters (`searchTerm`, `page`)
 * and provides handlers for search input changes, form submission, and clearing the search.
 *
 * @returns {Object} An object with:
 * - `searchInput` {string} Current value of the search input.
 * - `setSearchInput` {(value: string) => void} Setter for `searchInput`.
 * - `handleSearchInputChange` {(e: React.ChangeEvent<HTMLInputElement>) => void} Input change handler.
 * - `handleSearchSubmit` {(e: React.FormEvent<HTMLFormElement>) => void} Form submit handler, updates URL.
 * - `deleteSearchTerm` {() => void} Removes `searchTerm` from URL and resets search input.
 */

export default function useSearchMyProducts() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const initial = searchParams?.get("q") ?? "";
  const [searchInput, setSearchInput] = useState<string>(initial);

  const handleSearchInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInput(e.target.value);
    },
    []
  );

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const params = new URLSearchParams(
        Array.from(searchParams?.entries() ?? [])
      );
      if (searchInput && searchInput.trim() !== "") {
        params.set("searchTerm", searchInput.trim());
        params.set("page", "1");
      } else {
        params.delete("searchTerm");
        params.set("page", "1");
      }

      router.push(
        `${pathname}${params.toString() ? `?${params.toString()}` : ""}`
      );
    },
    [searchInput, pathname, router, searchParams]
  );

  const deleteSearchTerm = useCallback(() => {
    const params = new URLSearchParams(
      Array.from(searchParams?.entries() ?? [])
    );
    params.delete("searchTerm");
    params.set("page", "1");
    setSearchInput("");
    router.push(
      `${pathname}${params.toString() ? `?${params.toString()}` : ""}`
    );
  }, [pathname, router, searchParams]);

  return {
    searchInput,
    setSearchInput,
    handleSearchInputChange,
    handleSearchSubmit,
    deleteSearchTerm,
  };
}
