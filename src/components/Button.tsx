import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";

export default function Button({ children, ...props }: MuiButtonProps) {
  return <MuiButton {...props}>{children}</MuiButton>;
}
