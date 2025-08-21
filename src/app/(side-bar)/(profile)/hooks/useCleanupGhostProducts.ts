import { useEffect, useRef, useState } from "react";
import { fetchActiveProductsIds } from "@/lib/actions/fetch-active-products-ids";

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

export function useCleanUpGhostProducts(
  ids: number[],
  removeInactive: (inactiveIds: number[]) => void
) {
  const prevSignature = useRef<string | null>(null);

  useEffect(() => {
    if (ids.length === 0) return;
    const signature = idsSignature(ids);
    if (signature === prevSignature.current) return;
    prevSignature.current = signature;
    let cancelled = false;
    (async () => {
      try {
        const activeIds = await fetchActiveProductsIds(ids);
        if (cancelled) return;
        const activeSet = new Set(activeIds);
        const inactive = ids.filter((id) => !activeSet.has(id));
        if (inactive.length) removeInactive(inactive);
      } catch (e) {
        console.error("Error cleaning inactive products:", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ids, removeInactive]);
}
