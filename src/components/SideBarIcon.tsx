type SidebarIconProps = {
  Icon: React.ElementType;
  active: boolean;
};

export default function SidebarIcon({ Icon, active }: SidebarIconProps) {
  return <Icon size="20" color={active ? "#FE645E" : "#6E7378"} />;
}
