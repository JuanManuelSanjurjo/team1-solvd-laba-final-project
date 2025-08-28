"use client";

import { Box, Checkbox, FormControl } from "@mui/material";

/**
 * This component represents options of shoe sizes. It is built to be used as a checkbox, with the possibility of choosing more than one option at the same time.
 *
 * @component
 * @param {ShoeSizeOptionProps} props - Props for the component
 * @param {number} props.size - String that represents the size.
 * @returns {JSX.Element} The styled checkbox component
 *
 * @example
 * <ShoeSizeOption size={40} />
 */

type ShoeSizeOptionProps = {
  value?: number;
  size: number;
  disabled: boolean;
  checked?: boolean;
  onToggle?: (size: number) => void;
};

const baseStyles = {
  borderRadius: "8px",
  padding: "15px",
  textAlign: "center",
  cursor: "pointer",
  border: "1px solid #494949",
  width: "85px",
};

const stateStyles = {
  default: {
    color: "#5c5c5c",
    backgroundColor: "#ffffff",
    cursor: "pointer",
  },
  checked: {
    border: "1px solid #FE645E",
    color: "#FE645E",
  },
  disabled: {
    color: "#C3C3C3",
    backgroundColor: "#F0F0F0",
    cursor: "not-allowed",
  },
};

/**
 * ShoeSizeOption component that represents options of shoe sizes. It is built to be used as a checkbox, with the possibility of choosing more than one option at the same time.
 *
 * @component
 * @param {ShoeSizeOptionProps} props - Props for the component
 * @param {number} props.value - Value that represents the size.
 * @param {number} props.size - String that represents the size.
 * @param {boolean} props.disabled - Boolean that represents if the option is disabled.
 * @param {boolean} props.checked - Boolean that represents if the option is checked.
 * @param {function} props.onToggle - Function that is called when the option is toggled.
 * @returns {JSX.Element} The styled checkbox component
 *
 * @example
 * <ShoeSizeOption value={40} size={40} disabled={false} checked={false} onToggle={() => {}} />
 */
export default function ShoeSizeOption({
  value = 0,
  size,
  disabled,
  checked = false,
  onToggle = () => {},
}: ShoeSizeOptionProps) {
  const getState = () => {
    if (disabled) return "disabled";
    if (checked) return "checked";
    return "default";
  };

  const state = getState();

  return (
    <Box>
      <FormControl>
        <Checkbox
          sx={{ display: "none" }}
          checked={checked}
          onChange={() => {
            onToggle(value);
          }}
          disabled={disabled}
        />

        <Box
          sx={{
            ...baseStyles,
            ...stateStyles[state],
            transition: "all 0.2s ease-in",
          }}
          onClick={() => {
            if (!disabled) onToggle(value);
          }}
          data-testid="shoe-size-option"
        >
          EU-{size}
        </Box>
      </FormControl>
    </Box>
  );
}
