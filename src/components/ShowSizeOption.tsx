import { Box, Checkbox, FormControl } from "@mui/material"

/**
 * @component
 * @param {ShoeSizeOptionProps} props - Props for the component
 * @param {string} props.size - String that represents the size 
 * @returns {JSX.Element} The styled checkbox component
 */

type ShoeSizeOptionProps = {
    size: string
}

export default function ShoeSizeOption ({size} : ShoeSizeOptionProps) {
    return (
    <Box>
        <FormControl>
            
            <Checkbox sx={(theme) =>( { 
                border: `1px solid ${theme.palette.custom.darkGrey}`
            })} />
            

            <Box sx={{border: "1px solid #494949"}}> 
                {size}
            </Box>
        </FormControl>
    </Box>)
}