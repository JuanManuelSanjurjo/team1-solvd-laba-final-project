type SidebarIconProps = {
  Icon: React.ElementType;
  active: boolean;
};

/**
 * @component
 * @param {SidebarIconProps} props - Props for the sidebar icon
 * @param {React.ElementType} props.Icon - The icon component to render (e.g. from iconsax-react)
 * @param {boolean} props.active - Indicates if this icon is currently active (changes color).
 * @returns {JSX.Element} - The rendered sidebar icon.
 *
 * @example
 * <SidebarIcon
 *   Icon={HomeIcon}
 *   active={true}
 * />
 */
export default function SidebarIcon({ Icon, active }: SidebarIconProps) {
  return <Icon size="20" color={active ? "#FE645E" : "#6E7378"} />;
}
