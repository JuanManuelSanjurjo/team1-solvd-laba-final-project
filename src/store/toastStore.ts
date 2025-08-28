import { create } from "zustand";
import type { AlertProps } from "@mui/material";

type ToastState = {
  open: boolean;
  severity: AlertProps["severity"];
  message: string;
  show: (options: {
    severity: AlertProps["severity"];
    message: string;
  }) => void;
  hide: () => void;
};

/**
 * @function
 * @returns {ToastState} - A toast state instance.
 *
 * @example
 * const toastStore = useToastStore();
 */
export const useToastStore = create<ToastState>((set) => ({
  open: false,
  severity: "success",
  message: "",
  show: ({ severity, message }) => set({ open: true, severity, message }),
  hide: () => set({ open: false }),
}));
