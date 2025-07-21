"use client";

import { Typography } from "@mui/material";
import OrderStatusLabel from "./order-history/components/OrderStatusLabel";
import ProductCard from "@/components/ProductCard";
import OrderHistoryItemRow from "./order-history/components/OrderHistoryItemRow";
import HistoryOrderAccordion from "./order-history/components/HistoryOrderAccordion";
import Icon from "@/components/Icon";

export default function Home() {
  return (
    // <Typography variant="h1" color="secondary">
    //   Home Page
    // </Typography>
    <div>
      <br />
      <OrderStatusLabel status="shipped" isOpen width="160px" height="24px" />
      <OrderStatusLabel status="cancelled" width="164px" height="24px" />
      <OrderStatusLabel
        status="received"
        isOpen={false}
        width="164px"
        height="24px"
      />
      <br></br>
      <ProductCard
        imageUrl="/assets/product-img.png"
        name="Nike Air Max 270"
        description="Women's Shoes"
        size="8 UK"
        backgroundColor="white"
      />
      <br />
      <OrderHistoryItemRow
        orderNumber="N°987654"
        orderDate="18.07.2025"
        productCount={3}
        totalAmount="220$"
        status="cancelled"
      ></OrderHistoryItemRow>
      <OrderHistoryItemRow
        orderNumber="N°987655"
        orderDate="19.07.2025"
        productCount={2}
        totalAmount="100$"
        status="shipped"
      ></OrderHistoryItemRow>
      <OrderHistoryItemRow
        orderNumber="N°987656"
        orderDate="19.07.2025"
        productCount={5}
        totalAmount="350$"
        status="received"
      ></OrderHistoryItemRow>
      <br />
      <HistoryOrderAccordion
        orderInfo={{
          orderNumber: "N°987657",
          orderDate: "19-07-2025",
          productCount: 2,
          totalAmount: "$120",
          status: "shipped",
        }}
        details={{
          delivery: "Meest, #134-45 London",
          contacts: "Angelina Jones, +38 (095) 12 34 567, angelina@gmail.com",
          payment: "After payment",
          discount: "18$",
        }}
        products={[
          {
            imageUrl: "/assets/product-img.png",
            name: "Nike Air Max 270",
            description: "Women's Shoes",
            size: "8 UK",
            quantity: 1,
            price: "117$",
          },
          {
            imageUrl: "/assets/product-img.png",
            name: "Nike Air Max 270",
            description: "Women's Shoes",
            size: "8 UK",
            quantity: 1,
            price: "117$",
          },
        ]}
      />

      <br></br>
      <HistoryOrderAccordion
        orderInfo={{
          orderNumber: "N°987657",
          orderDate: "19-07-2025",
          productCount: 2,
          totalAmount: "$120",
          status: "shipped",
        }}
        details={{
          delivery: "Meest, #134-45 London",
          contacts: "Angelina Jones, +38 (095) 12 34 567, angelina@gmail.com",
          payment: "After payment",
          discount: "18$",
        }}
        products={[
          {
            imageUrl: "/assets/product-img.png",
            name: "Nike Air Max 270",
            description: "Women's Shoes",
            size: "8 UK",
            quantity: 1,
            price: "117$",
          },
          {
            imageUrl: "/assets/product-img.png",
            name: "Nike Air Max 270",
            description: "Women's Shoes",
            size: "8 UK",
            quantity: 1,
            price: "117$",
          },
        ]}
      />
      <br></br>
      <HistoryOrderAccordion
        orderInfo={{
          orderNumber: "N°987657",
          orderDate: "19-07-2025",
          productCount: 2,
          totalAmount: "$120",
          status: "shipped",
        }}
        details={{
          delivery: "Meest, #134-45 London",
          contacts: "Angelina Jones, +38 (095) 12 34 567, angelina@gmail.com",
          payment: "After payment",
          discount: "18$",
        }}
        products={[
          {
            imageUrl: "/assets/product-img.png",
            name: "Nike Air Max 270",
            description: "Women's Shoes",
            size: "8 UK",
            quantity: 1,
            price: "117$",
          },
          {
            imageUrl: "/assets/product-img.png",
            name: "Nike Air Max 270",
            description: "Women's Shoes",
            size: "8 UK",
            quantity: 1,
            price: "117$",
          },
        ]}
      />
      <br></br>
      <Icon name="More" size={15} color="green" variant="Bold"></Icon>
      <Icon name="More" size={24} color="red" variant="Outline"></Icon>
      <Icon name="More" size={46} color="yellow" variant="Bulk"></Icon>
      <Icon name="More" color="black"></Icon>
    </div>
  );
}
