"use client";

import { JSX } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  ListItemButton,
  Button,
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
import SidebarIcon from "./SideBarIcon";
import WelcomeComponent from "./WelcomeComponent";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";

const navItems = [
  {
    label: "My Products",
    href: "/my-products",
    Icon: BagTick,
    component: Link,
  },
  {
    label: "Order History",
    href: "/order-history",
    Icon: MenuBoard,
    component: Link,
  },
  {
    label: "My Wishlist",
    href: "/my-wishlist",
    Icon: HeartSearch,
    component: Link,
  },
  {
    label: "Recently viewed",
    href: "/recently-viewed",
    Icon: Eye,
    component: Link,
  },
  {
    label: "Settings",
    href: "/update-profile",
    Icon: Setting2,
    component: Link,
  },
  {
    label: "Log out",
    href: "/logout",
    Icon: Logout,
    component: Button,
  },
];

type AuthenticatedSidebarProps = {
  showProfileComponent?: boolean;
  anchor?: "left" | "right";
  backgroundColor?: string;
  width?: number | string;
  session: Session | null;
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
  session,
  showProfileComponent = true,
  width,
}: AuthenticatedSidebarProps): JSX.Element => {
  const pathname = usePathname();
  // const { data: session } = useSession();

  const drawerWidth = {
    md: 240,
    lg: 320,
  };

  const sidebarWidth = width || drawerWidth;

  const handleLogout = () => {
    signOut();
  };
  return (
    <Box width={sidebarWidth}>
      <Box display="flex" flexDirection="column" height="100%">
        {showProfileComponent && (
          <>
            <WelcomeComponent
              src={session?.user?.avatar?.url || ""}
              name={session?.user?.username}
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
          {navItems.map(({ label, href, Icon, component }) => {
            return (
              <ListItem key={label} disablePadding>
                <ListItemButton
                  component={component}
                  href={component === Link ? href : undefined}
                  sx={{
                    "& .MuiListItemText-primary": {
                      color: pathname === href ? "#FE645E" : "#6E7378",
                      fontWeight: pathname === href ? 600 : 400,
                      fontSize: { xs: "0.9rem", lg: "1rem" },
                      lineHeight: "100%",
                    },
                    "& .MuiListItemIcon-root": {
                      minWidth: 32,
                    },
                  }}
                  onClick={component === Link ? undefined : handleLogout}
                >
                  <ListItemIcon>
                    <SidebarIcon Icon={Icon} active={pathname === href} />
                  </ListItemIcon>
                  <ListItemText primary={label} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
};

export default AuthenticatedSidebar;
