"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchProductsBySearch } from "@/lib/strapi/fetchProductsBySearch";
import useDebounce from "@/hooks/useDebounce";

/**
 * useHeaderSearch
 *
 * This hook is used to handle the search input and search results.
 * It returns the search input, search results, and functions to toggle the search, handle search input changes, and handle search submit.
 *
 * @returns {Object} The search input, search results, and a function to toggle the search.
 */

export default function useHeaderSearch() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchInput = useDebounce(searchInput, 300);
  const [isSearching, setIsSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleSearch = () => {
    setIsSearching(!isSearching);
    setSearchInput("");
  };

  const { data: searchResults = [] } = useQuery({
    queryKey: ["products", debouncedSearchInput],
    queryFn: () =>
      fetchProductsBySearch(
        debouncedSearchInput,
        ["name", "color.name", "gender.name"],
        ["color.name", "gender.name", "images.url"],
        1,
        5,
      ),
    enabled: isSearching && debouncedSearchInput.length > 1,
  });

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSearching(false);
    router.push(`/products?searchTerm=${searchInput}`);
  }

  const handleToggleDrawer = () => {
    setOpen(!open);
  };
  function handleEscapeKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setIsSearching(false);
    }
  }
  return {
    isSearching,
    setIsSearching,
    searchInput,
    setSearchInput,
    toggleSearch,
    handleSearchInputChange,
    handleSearchSubmit,
    handleToggleDrawer,
    open,
    setOpen,
    handleEscapeKey,
    searchResults,
  };
}
