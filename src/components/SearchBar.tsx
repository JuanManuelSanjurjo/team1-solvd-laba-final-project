"use client";
import React from "react";
import { Box, InputBase } from "@mui/material";
import { SearchNormal } from "iconsax-react";

type SearchBarSize = "large" | "medium" | "small" | "xsmall";

interface SearchBarProps {
  placeholder?: string;
  size?: SearchBarSize;
  fullWidth?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  focus?: boolean;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  value?: string;
}

const sizeStyles = {
  large: {
    height: 79,
    fontSize: 24,
    iconSize: 27,
    paddingX: 4,
    width: "60%",
  },
  medium: {
    height: 48,
    fontSize: 18,
    iconSize: 20,
    paddingX: 2.5,
    width: 320,
  },
  small: {
    height: 32,
    fontSize: 14,
    iconSize: 16,
    paddingX: 2,
    width: 215,
  },
  xsmall: {
    height: 25,
    fontSize: 12,
    iconSize: 14,
    paddingX: 1.5,
    width: 290,
  },
};

/**
 * SearchBar component renders a customizable search input with an icon,
 * supporting multiple predefined sizes and optional full-width behavior.
 *
 * It uses MUI's `Box` and `InputBase`, and includes a `SearchNormal` icon from iconsax-react.
 * The size prop controls the height, font size, icon size, padding, and width of the search bar.
 *
 * @component
 * @example
 *
 * <SearchBar size="medium" placeholder="Search" fullWidth />
 *
 *
 * @param {Object} props - Component props
 * @param {string} [props.placeholder='Search'] - Placeholder text shown inside the input field.
 * @param {'large' | 'medium' | 'small' | 'xsmall'} [props.size='large'] - Controls the visual size of the search bar.
 * @param {boolean} [props.fullWidth=false] - If true, the search bar will stretch to 100% of its container's width.
 *
 * @returns {JSX.Element} A styled search input with an accompanying icon.
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search",
  size = "large",
  fullWidth = false,
  focus = false,
  onChange,
  onSubmit,
  value,
}) => {
  const style = sizeStyles[size];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: fullWidth ? "100%" : style.width,
        height: style.height,
        borderRadius: "999px",
        border: "1px solid #494949",
        px: style.paddingX,
      }}
    >
      <form
        onSubmit={onSubmit}
        style={{ display: "flex", alignItems: "center" }}
      >
        <SearchNormal
          style={{ width: style.iconSize, marginRight: 12, cursor: "pointer" }}
          color="#494949"
        />
        <InputBase
          placeholder={placeholder}
          onChange={onChange}
          autoFocus={focus}
          value={value}
          sx={{
            flex: 1,
            fontSize: style.fontSize,
            color: "text.secondary",
            "& input::placeholder": {
              color: "text.secondary",
              opacity: 1,
            },
          }}
        />
      </form>
    </Box>
  );
};
