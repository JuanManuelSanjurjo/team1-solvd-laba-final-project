import { JSX } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { Heart, HeartSlash, Add } from "iconsax-react";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Backdrop from "@mui/material/Backdrop";

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
          <List>
            {["My products", "Settings", "log out"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? (
                      <Heart size="22" color="#FE645E" />
                    ) : (
                      <HeartSlash size="22" color="#FE645E" />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Backdrop>
    </Box>
  );
}
