"use client";
import { JSX } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  ListItemButton,
} from "@mui/material";
import {
  BagTick,
  MenuBoard,
  HeartSearch,
  Eye,
  Setting2,
  Logout,
} from "iconsax-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import SidebarIcon from "./SideBarIcon";
import WelcomeComponent from "./WelcomeComponent";

const navItems = [
  {
    label: "My Products",
    href: "/my-products",
    Icon: BagTick,
  },
  {
    label: "Order History",
    href: "/order-history",
    Icon: MenuBoard,
  },
  {
    label: "My Wishlist",
    href: "/my-wishlist",
    Icon: HeartSearch,
  },
  {
    label: "Recently viewed",
    href: "/recently-viewed",
    Icon: Eye,
  },
  {
    label: "Settings",
    href: "/update-profile",
    Icon: Setting2,
  },
  {
    label: "Log out",
    href: "/logout",
    Icon: Logout,
  },
];

type AuthenticatedSidebarProps = {
  showProfileComponent?: boolean;
  anchor?: "left" | "right";
  backgroundColor?: string;
  width?: number | string;
};

/**
 * AuthenticatedSidebar
 *
 * Renders a permanent sidebar navigation drawer for authenticated users.
 * It includes navigation links, icons, and an optional profile section.
 * The sidebar is responsive and styled according to the current MUI theme.
 *
 * @component
 *
 * @param {Object} props - Props for the sidebar component.
 * @param {boolean} [props.showProfileComponent=true] - Whether to display the profile section at the top.
 * @param {"left" | "right"} [props.anchor="left"] - The side from which the drawer appears.
 * @param {string} [props.backgroundColor] - Custom background color for the sidebar.
 * @param {number | string} [props.width] - Custom width for the sidebar. Defaults to 240px on md screens, and 320px on lg.
 *
 * @returns {JSX.Element} A styled permanent sidebar with navigation items and optional user info.
 *
 * @example
 * <AuthenticatedSidebar
 *   showProfileComponent={true}
 *   anchor="left"
 *   backgroundColor="#f5f5f5"
 *   width={280}
 * />
 */

const AuthenticatedSidebar = ({
  showProfileComponent = true,
  anchor = "left",
  backgroundColor,
  width,
}: AuthenticatedSidebarProps): JSX.Element => {
  const theme = useTheme();
  const pathname = usePathname();
  const background = backgroundColor || theme.palette.background.default;

  const drawerWidth = {
    md: 240,
    lg: 320,
  };

  const sidebarWidth = width || drawerWidth;

  return (
    <Drawer
      variant="permanent"
      anchor={anchor}
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: sidebarWidth,
          boxSizing: "border-box",
          top: {
            xs: "60px",
            md: "120px",
          },
          backgroundColor: background,
          borderRight: "none",
        },
      }}
    >
      <Box display="flex" flexDirection="column" height="100%">
        {showProfileComponent && (
          <>
            {/* TODO change hardcoded src and name for user data*/}
            <WelcomeComponent
              src="www.coolavatarbystrapi.com/images/upload/1.jpg"
              name="Jane Meldrum"
            />
            <Divider />
          </>
        )}

        <List
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            ml: { xs: 2, md: 5 },
            mt: { xs: 2, md: 3 },
            "& .MuiListItemText-primary": {
              typography: "body1",
              fontWeight: 500,
              lineHeight: "100%",
            },
          }}
        >
          {navItems.map(({ label, href, Icon }) => {
            const isActive = pathname === href;

            return (
              <ListItem key={label} disablePadding>
                <ListItemButton
                  component={Link}
                  href={href}
                  sx={{
                    "& .MuiListItemText-primary": {
                      color: isActive ? "#FE645E" : "#6E7378",
                      fontWeight: isActive ? 600 : 400,
                      fontSize: { xs: "0.9rem", md: "1rem" },
                      lineHeight: "100%",
                    },
                    "& .MuiListItemIcon-root": {
                      minWidth: 32,
                    },
                  }}
                >
                  <ListItemIcon>
                    <SidebarIcon Icon={Icon} active={isActive} />
                  </ListItemIcon>
                  <ListItemText primary={label} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default AuthenticatedSidebar;
