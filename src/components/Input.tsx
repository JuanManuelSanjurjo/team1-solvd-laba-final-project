import {OutlinedInput, FormControl, OutlinedInputProps, Typography, Box, FormHelperText } from "@mui/material";
import { JSX } from "react";
import { Danger } from "iconsax-react";

/**
 * A wrapper around MUI's input comoponent
 * 
 * @component
 * @param {MuiInputProps} props - All props supported by MUI's Input Component
 * 
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

            <OutlinedInput id={`${name}`} placeholder={placeholder} required={required} {...props}/>

            {hasError && <FormHelperText sx={{}}><Danger color="#FE645E" size="16" />{errorMessage}</FormHelperText>}
            
        </FormControl>
    )
}