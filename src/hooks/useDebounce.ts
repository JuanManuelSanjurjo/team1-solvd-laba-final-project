"use client";
import { useState, useEffect } from "react";

/**
 * @hook
 * @param {string} value - The value to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {string} - The debounced value.
 *
 * @example
 * const debouncedValue = useDebounce(searchTerm, 300);
 */
export default function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
