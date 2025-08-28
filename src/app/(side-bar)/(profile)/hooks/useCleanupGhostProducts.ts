import { useEffect, useRef, useState } from "react";
import { fetchActiveProductsIds } from "@/lib/actions/fetch-active-products-ids";
import { useCartStore } from "@/store/cart-store";

/**
 * Custom hook that checks if the client has hydrated.
 *
 * @returns {boolean} - Returns true if the client has hydrated, false otherwise.
 */
export function useClientHydrated() {
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  return isHydrated;
}

function idsSignature(ids: number[]) {
  return Array.from(new Set(ids))
    .sort((a, b) => a - b)
    .join(",");
}
/**
 * Custom hook that cleans up inactive products from the cart.
 *
 * @param {number[]} ids - The array of product IDs to check for inactivity.
 * @param {function} removeInactive - The function to call to remove inactive products.
 * @returns {boolean} - Returns true if the cleanup is loading, false otherwise.
 */
export function useCleanUpGhostProducts(
  ids: number[],
  removeInactive: (inactiveIds: number[]) => void
) {
  const prevSignature = useRef<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ids.length === 0) return;
    const signature = idsSignature(ids);
    if (signature === prevSignature.current) return;
    prevSignature.current = signature;
    setLoading(true);
    (async () => {
      try {
        const activeIds = await fetchActiveProductsIds(ids);
        const activeSet = new Set(activeIds);
        const inactive = ids.filter((id) => !activeSet.has(id));
        if (inactive.length) removeInactive(inactive);
      } catch (e) {
        console.error("Error cleaning inactive products:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [ids, removeInactive]);
  return loading;
}
