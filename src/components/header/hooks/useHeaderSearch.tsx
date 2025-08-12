import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchProductsBySearch } from "@/lib/strapi/fetchProductsBySearch";
import { useDeferredValue } from "react";

export default function useHeaderSearch() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const deferredSearchInput = useDeferredValue(searchInput);
  const [isSearching, setIsSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleSearch = () => {
    setIsSearching(!isSearching);
    setSearchInput("");
  };

  const { data: searchResults = [] } = useQuery({
    queryKey: ["products", searchInput],
    queryFn: () =>
      fetchProductsBySearch(
        deferredSearchInput,
        ["name", "color.name", "gender.name"],
        ["color.name", "gender.name", "images.url"],
        1,
        5,
      ),
    enabled: isSearching && deferredSearchInput.length > 1,
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
