"use client";
import { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * useSearchMyProducts
 *
 * This hook handles the search functionality for the My Products page.
 * It allows users to search for products by name or description.
 *
 * @component
 *
 * @returns {Object} The search state and functions
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
