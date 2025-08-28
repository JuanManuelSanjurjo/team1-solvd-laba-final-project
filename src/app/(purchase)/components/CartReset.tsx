"use client";
import { useEffect } from "react";
import { useCartStore } from "@/store/cart-store";

export default function CartReset({ userId }: { userId: string }) {
  const { clearCart } = useCartStore();
  useEffect(() => {
    clearCart(userId);
  }, [clearCart, userId]);

  return null;
}
