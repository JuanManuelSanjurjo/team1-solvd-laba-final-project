import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";
import { JSX } from "react";

/**
 * A wrapper around MUI's Button component.
 *
 * This custom Button allows for future customization or theming while preserving
 * the default behavior and props of the MUI Button.
 *
 * @component
 * @param {MuiButtonProps} props - All props supported by MUI's Button component
 * @param {React.ReactNode} props.children - The content inside the button
 * @returns {JSX.Element}
 *
 * @example
 * <Button variant="contained" color="primary">
 *   Click Me
 * </Button>
 */
export default function Button({
  children,
  ...props
}: MuiButtonProps): JSX.Element {
  return <MuiButton {...props}>{children}</MuiButton>;
}
