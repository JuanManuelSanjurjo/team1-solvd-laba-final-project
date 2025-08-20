"use client";
import { useToastStore } from "@/store/toastStore";
import Toast from "@/components/Toast";
import { JSX } from "react";

/**
 * ToastHost component that renders a global toast notification based on store state.
 * Uses Zustand's `useToastStore` to read the open status, message, severity, and close handler.
 *
 * This component should be rendered once in the layout or root component to ensure toast messages
 * are available throughout the app.
 *
 * @component
 * @returns {JSX.Element} A Toast component controlled by global store state.
 */

export default function ToastHost(): JSX.Element {
  const { open, severity, message, hide } = useToastStore();

  return (
    <Toast open={open} onClose={hide} severity={severity} message={message} />
  );
}
