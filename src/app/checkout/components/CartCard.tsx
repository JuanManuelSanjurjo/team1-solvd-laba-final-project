"use client"
import ProductQuantityButton from '@/components/Buttons/ProductQuantityButton'
import { Typography, Box } from '@mui/material'
import { JSX } from 'react'
import Button from '@/components/Button'
import { Trash } from 'iconsax-react'

type CartCardProps = {
    quantity: number,
    handleAdd(): void,
    handleRest(): void
}

const CartCard = ({quantity, handleAdd, handleRest, productName, gender, stock} : CartCardProps) :JSX.Element => {

  return (
    <article>
        <Box>
            
        </Box>
 
        <Box sx={{display: "flex", alignItems: "center", gap:"17px"}}>
            <Box sx={{borderLeft: "1px solid #8B8E93", display: "flex",  alignItems: "center", gap:"9px", paddingLeft: "17px" }}>
                <ProductQuantityButton onClick={handleAdd} type="Add" />
                <Typography variant="h4" color="#494949">{quantity}</Typography>
                <ProductQuantityButton OnClick={handleRest} type="Minus"/>
                <Typography variant="h4" color="#494949">Quantity</Typography>
            </Box>

        <Button sx={{color: "#8B8E93", fontSize:"24px", }} startIcon={<Trash size={24} color='#8B8E93' />}>Delete</Button>
        </Box>
        
     
    </article>
  )
}

export default CartCard
