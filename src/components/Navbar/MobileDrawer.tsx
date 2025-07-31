import { JSX } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { Add } from "iconsax-react";
import IconButton from "@mui/material/IconButton";
import Backdrop from "@mui/material/Backdrop";
import AuthenticatedSidebar from "../AuthenticatedSidebar";
import theme from "@/style/theme";

interface AppBarProps {
  open: boolean;
  handleDrawerClose: () => void;
}

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

export default function MobileDrawer({
  open,
  handleDrawerClose,
}: AppBarProps): JSX.Element {
  return (
    <Box sx={{ display: "flex" }}>
      <Backdrop
        sx={{
          zIndex: 10,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(3px)",
        }}
        open={open}
        onClick={handleDrawerClose}
      >
        <Drawer
          sx={{
            width: 240,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 240,
            },
          }}
          variant="persistent"
          anchor="right"
          open={open}
        >
          <DrawerHeader sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton
              onClick={handleDrawerClose}
              sx={{ transform: "rotate(45deg)" }}
            >
              <Add size="24" color="#494949" />
            </IconButton>
          </DrawerHeader>
          <AuthenticatedSidebar
            showProfileComponent={false}
            anchor="right"
            backgroundColor={theme.palette.background.paper}
            width={240}
          ></AuthenticatedSidebar>
        </Drawer>
      </Backdrop>
    </Box>
  );
}
