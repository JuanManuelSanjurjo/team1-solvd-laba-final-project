// Page only for testing components

"use client";
// import NavigationArrows from "@/components/NavigationArrows";
import HistoryOrderAccordion from "../order-history/components/HistoryOrderAccordion";
import { Box, Divider, Stack, Typography } from "@mui/material";
// import Testimonials from "../auth/sign-up/components/Testimonials";
// import Gallery from "@/components/gallery/Gallery";
// import CardContainer from "@/components/cards/CardContainer";
import Button from "@/components/Button";
import AiButton from "@/components/AiButton";
import { SearchBar } from "@/components/SearchBar";
import { Header } from "@/components/Header";
import { ProfilePicture } from "@/components/ProfilePicture";
import FilterCheckbox from "@/components/FilterCheckBox";
import OrderHistoryItemRow from "../order-history/components/OrderHistoryItemRow";
import ShoeSizeOption from "@/components/ShowSizeOption";
import Icon from "@/components/Icon";
import { LogoBlackSvg } from "@/components/LogoBlackSvg";
import PaymentMethodOption from "@/components/PaymentMethodOption";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { Wallet } from "iconsax-react";

// const imagesArr = [
//   "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=698&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   "https://images.unsplash.com/photo-1570464197285-9949814674a7?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1112&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   "https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=1112&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   "https://plus.unsplash.com/premium_photo-1712767020436-18875018fca3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
// ];

export default function Playground() {
  return (
    <main
      style={{
        backgroundColor: "#ffffff",
        color: "black",
      }}
    >
      <Stack
        direction="column"
        sx={{
          width: "100%",
          padding: 2,
        }}
      >
        <Typography variant="h1">Playground</Typography>
        {/* <Typography variant="h3">Navigation Arrows</Typography>
        <Box display="flex" alignItems="flex-start">
          <NavigationArrows variant="testimonials"></NavigationArrows>
          <NavigationArrows variant="product_card"></NavigationArrows>
        </Box>
        <Divider
          sx={{
            width: "100%",
            borderBottomWidth: "5px",
            paddingBottom: 3,
          }}
        />
        <Typography variant="h3" sx={{ padding: 2 }}>
          Testimonials
        </Typography>
        <Box
          sx={{
            position: "relative",
            transform: "translate(10%, 5%)",
            width: "50%",
          }}
        >
          <Testimonials variant="testimonials"></Testimonials>
        </Box>
        <Box
          sx={{
            position: "relative",
            transform: "translate(10%, 5%)",
            width: "50%",
          }}
        >
          <Testimonials variant="product_card"></Testimonials>
        </Box>
        <Divider
          sx={{
            width: "100%",
            borderBottomWidth: "5px",
            paddingBottom: 3,
          }}
        />
        <Typography variant="h3" sx={{ padding: 2 }}>
          Gallery
        </Typography>
        <Gallery images={imagesArr}></Gallery>
        <Divider
          sx={{
            width: "100%",
            borderBottomWidth: "5px",
            paddingBottom: 3,
          }}
        />
        <Typography variant="h3" sx={{ padding: 2 }}>
          Card Container
        </Typography>
        <CardContainer images={imagesArr}></CardContainer>
        <Divider
          sx={{
            width: "100%",
            borderBottomWidth: "5px",
            paddingBottom: 3,
          }}
        /> */}
        <Typography variant="h3" sx={{ padding: 2 }}>
          Buttons
        </Typography>
        <Box>
          <Button variant="outlined" color="primary">
            Outline button
          </Button>
        </Box>
        <br></br>
        <Box>
          <Button variant="contained" color="primary">
            Filled button
          </Button>
        </Box>
        <br></br>
        <Box>
          <AiButton size="small" /*onClick={handleAction}*/ />
        </Box>
        <Divider
          sx={{
            width: "100%",
            borderBottomWidth: "5px",
            paddingBottom: 3,
          }}
        />
        <Typography variant="h3" sx={{ padding: 2 }}>
          SearchBar
        </Typography>
        <br></br>
        <SearchBar size="medium" placeholder="Search" fullWidth />
        <br></br>
        <SearchBar size="large" placeholder="Search" />
        <br></br>
        <SearchBar size="xsmall" placeholder="Search" />
        <br></br>
        <Divider
          sx={{
            width: "100%",
            borderBottomWidth: "5px",
            paddingBottom: 3,
          }}
        />
        <Typography variant="h3" sx={{ padding: 2 }}>
          Headers
        </Typography>
        <Box>
          <Header isAuthenticated={true} />
        </Box>
        <Box>
          <Header isAuthenticated={false} />
        </Box>
        <Divider
          sx={{
            width: "100%",
            borderBottomWidth: "5px",
            paddingBottom: 3,
          }}
        />
        <Typography variant="h3" sx={{ padding: 2 }}>
          Profile Pictures
        </Typography>
        <ProfilePicture
          src="www.coolavatarbystrapi.com/images/upload/1.jpg"
          alt="User avatar"
          width={40}
        />
        <ProfilePicture
          src="www.coolavatarbystrapi.com/images/upload/1.jpg"
          alt="User avatar"
          width={100}
        />
        <ProfilePicture
          src="www.coolavatarbystrapi.com/images/upload/1.jpg"
          alt="User avatar"
          width={250}
        />
        <Divider
          sx={{
            width: "100%",
            borderBottomWidth: "5px",
            paddingBottom: 3,
          }}
        />
        <Typography variant="h3" sx={{ padding: 2 }}>
          Checkboxes
        </Typography>
        <FilterCheckbox
          label="Red"
          checked={true}
          onChange={(e) => console.log(e.target.checked)}
          count={24}
        ></FilterCheckbox>
        <FilterCheckbox
          label="Red"
          checked={false}
          onChange={(e) => console.log(e.target.checked)}
          count={24}
        ></FilterCheckbox>
        <Divider
          sx={{
            width: "100%",
            borderBottomWidth: "5px",
            paddingBottom: 3,
          }}
        />
        <Typography variant="h3" sx={{ padding: 2 }}>
          Size options
        </Typography>
        <ShoeSizeOption size={40} disabled />
        <ShoeSizeOption size={38} disabled={false} />
        <Divider
          sx={{
            width: "100%",
            borderBottomWidth: "5px",
            paddingBottom: 3,
          }}
        />
        <Typography variant="h3" sx={{ padding: 2 }}>
          Icons
        </Typography>
        <LogoBlackSvg width={41} height={31}></LogoBlackSvg>
        <LogoBlackSvg width={50} height={50}></LogoBlackSvg>
        <Icon name="More" size={15} color="green" variant="Bold"></Icon>
        <Icon name="More" size={25} color="red" variant="Bold"></Icon>
        <Divider
          sx={{
            width: "100%",
            borderBottomWidth: "5px",
            paddingBottom: 3,
          }}
        />
        <Typography variant="h3" sx={{ padding: 2 }}>
          Payments options
        </Typography>
        <PaymentMethodOption
          icon={CreditCardIcon}
          label="Credit Card"
          selected={true}
        ></PaymentMethodOption>
        <br></br>
        <PaymentMethodOption
          icon={Wallet}
          label="Cash App pay"
          selected={true}
        ></PaymentMethodOption>
        <Divider
          sx={{
            width: "100%",
            borderBottomWidth: "5px",
            paddingBottom: 3,
          }}
        />
        <Typography variant="h3" sx={{ padding: 2 }}>
          Status Order
        </Typography>
        <OrderHistoryItemRow
          orderNumber="N°987654"
          orderDate="18.07.2025"
          productCount={3}
          totalAmount="220$"
          status="cancelled"
        ></OrderHistoryItemRow>
        *{" "}
        <OrderHistoryItemRow
          orderNumber="N°987655"
          orderDate="19.07.2025"
          productCount={2}
          totalAmount="100$"
          status="shipped"
        ></OrderHistoryItemRow>
        *{" "}
        <OrderHistoryItemRow
          orderNumber="N°987656"
          orderDate="19.07.2025"
          productCount={5}
          totalAmount="350$"
          status="received"
        ></OrderHistoryItemRow>
        <Divider
          sx={{
            width: "100%",
            borderBottomWidth: "5px",
            paddingBottom: 3,
          }}
        />
        <Typography variant="h3" sx={{ padding: 2 }}>
          HistoryOrderAccordion
        </Typography>
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
        ></HistoryOrderAccordion>
      </Stack>
    </main>
  );
}
