import * as icons from "iconsax-react";

type IconProps = {
  name: keyof typeof icons;
  size?: number;
  color?: string;
  variant?: "Linear" | "Bold" | "Broken" | "Bulk" | "Outline" | "TwoTone";
  className?: string;
};

/**
 * Renders a customizable icon from iconsax-react library.
 * Useful for displaying consistent iconography with variant, size, and color options.
 *
 * @component
 *
 * @param name -  The icon name from the iconsax-react set (e.g., "Home", "User").
 * @size - (Optional) The size of the icon in pixels. Default is 20.
 * @color - (Optional) The color of the icon. Default is "black".
 * @variant Optional) The visual style of the icon. One of: 'Linear', 'Bold', 'Broken', 'Bulk', 'Outline', 'TwoTone'. Default is 'Linear'.
 * @className  (Optional) Custom CSS class to apply to the icon.
 * @returns {JSX.Element}
 * @example
 * <Icon name="More" size={15} color="green" variant="Bold"></Icon>
 */
export default function Icon({
  name,
  size = 20,
  color = "black",
  variant = "Linear",
  className,
}: IconProps) {
  const IconComponent = icons[name] as React.ElementType;

  return (
    <IconComponent
      size={size}
      color={color}
      variant={variant}
      className={className}
    ></IconComponent>
  );
}
