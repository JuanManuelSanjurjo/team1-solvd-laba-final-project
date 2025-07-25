"use client"

import { Box, Checkbox, FormControl } from "@mui/material"
import { useState } from "react"

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
    size: number
    disabled: boolean
}

const baseStyles = {
  borderRadius: "8px",
  padding: "15px",
  textAlign: "center",
  cursor: "pointer",
  border: "1px solid #494949",
}

const stateStyles = {
    default: {
        color: "#5c5c5c",
        backgroundColor: "#ffffff",
        cursor: "pointer"

    },
    checked: {
        border: "1px solid #FE645E",
        color: "#FE645E"
    },
    disabled: {
        color: "#C3C3C3",
        backgroundColor: "#F0F0F0",
        cursor: "not-allowed",

    }
}

export default function ShoeSizeOption ({size, disabled} : ShoeSizeOptionProps) {
    const [checked, setChecked] = useState(false);
    
    const getState = () => {
    if (disabled) return "disabled"
    if (checked) return "checked"
    return "default"
  }

    const state = getState()

  
    return (
    <Box>
        <FormControl>
            <Checkbox sx={{display: "none"}} checked={checked} onChange={(e)=> setChecked(e.target.checked)} disabled={disabled}/>

            <Box   sx={{
            ...baseStyles,
            ...stateStyles[state],
            }}  

            onClick={() => {if (!disabled) setChecked(!checked)}}> 
                EU-{size}
            </Box>
        </FormControl>
    </Box>)
}