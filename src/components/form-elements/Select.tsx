import {
  MenuItem,
  SelectProps as MuiSelectProps,
  Select as MuiSelect,
  FormControl,
  Box,
  Typography,
} from "@mui/material";

/**
 * A wrapper around MUI's select component
 *
 * @component
 * @param {MuiSelectProps} props - All props supported by MUI's Select component
 */
type Option = {
  label: string;
  value: string | number;
};

type SelectProps = {
  name: string;
  label: string;
  required?: boolean;
  placeholder: string;
  options: Option[];
} & MuiSelectProps;

/**
 * Select component that displays a select element.
 *
 * @component
 * @param {SelectProps} props - Props for the component
 * @param {string} props.name - Name of the select element.
 * @param {string} props.label - Label of the select element.
 * @param {boolean} props.required - Boolean that represents if the select element is required.
 * @param {string} props.placeholder - Placeholder of the select element.
 * @param {Option[]} props.options - Options of the select element.
 * @returns {JSX.Element} The rendered select component
 */
export default function Select({
  options,
  label,
  required,
  name,
  placeholder,
  ...props
}: SelectProps) {
  return (
    <FormControl variant="outlined" fullWidth>
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
      <MuiSelect displayEmpty variant="outlined" {...props}>
        <MenuItem disabled value="">
          {placeholder}
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
}
