import {
  OutlinedInput,
  FormControl,
  OutlinedInputProps,
  Typography,
  Box,
  FormHelperText,
} from "@mui/material";
import { forwardRef, JSX } from "react";
import { Danger } from "iconsax-react";

/**
 * A reusable input field built on top of MUI's OutlinedInput.
 * It includes label rendering, required marker, and error display with an icon.
 *
 * @component
 * @param {MuiInputProps} props - Props for the input component.
 * @param {string} props.label - The visible label above the input.
 * @param {boolean} [props.required] - Whether the field is required. If true, an asterisk is shown.
 * @param {string} props.errorMessage - Error message shown below the input (if present).
 * @param {string} [props.placeholder] - Placeholder text for the input.
 * @returns {JSX.Element} The styled input component.
 *
 * @example
 *  <Input
 *   name="email"
 *   label="Email Address"
 *   required
 *   placeholder="Enter your email"
 *   errorMessage={formErrors.email}
 *   value={formData.email}
 *   onChange={handleChange}
 *  />
 */

type MuiInputProps = {
  name: string;
  label: string;
  required?: boolean;
  errorMessage: string;
} & Omit<OutlinedInputProps, "error">;

const Input = forwardRef<HTMLInputElement, MuiInputProps>(
  (
    { name, label, placeholder, required, errorMessage, ...props },
    ref
  ): JSX.Element => {
    const hasError = Boolean(errorMessage);

    return (
      <FormControl error={hasError}>
        <Typography
          component="label"
          htmlFor={name}
          variant="body2"
          color="#494949"
          sx={{ marginBottom: "8px" }}
        >
          {label}
          {required && (
            <Box component="span" sx={{ color: "primary.main" }}>
              {" "}
              *
            </Box>
          )}
        </Typography>

        <OutlinedInput
          error={hasError}
          id={name}
          name={name}
          placeholder={placeholder}
          required={required}
          sx={{ height: "48px" }}
          inputRef={ref}
          {...props}
        />

        {hasError && (
          <FormHelperText>
            <Danger color="#FE645E" size="16" style={{ marginRight: "6px" }} />
            {errorMessage}
          </FormHelperText>
        )}
      </FormControl>
    );
  }
);

Input.displayName = "Input";

export default Input;
