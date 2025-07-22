import {OutlinedInput, FormControl, OutlinedInputProps, Typography, Box, FormHelperText } from "@mui/material";
import { JSX } from "react";
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
    name: string
    label: string
    required?: boolean,
    errorMessage: string
} & Omit<OutlinedInputProps, 'error'> 

export default function Input (
    {name, label, placeholder, required, errorMessage, ...props} : MuiInputProps) : JSX.Element {

    const hasError = Boolean(errorMessage);
    
    return (
        <FormControl error={Boolean(errorMessage)}>
            {/* <InputLabel htmlFor={name}>{label}</InputLabel> */}
            <Typography component="label" htmlFor={name} variant="body2" color="#494949" sx={{marginBottom: '8px'}}>
                {label}
                { required && <Box component="span" sx={{color: "primary.main"}}> *</Box>} 
            </Typography>

            <OutlinedInput error={hasError} id={`${name}`} placeholder={placeholder} required={required} {...props}/>

            {hasError && <FormHelperText sx={{}}><Danger color="#FE645E" size="16" />{errorMessage}</FormHelperText>}
        </FormControl>
    )
}