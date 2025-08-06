import { Box, Typography } from "@mui/material";

/**
 * @component
 * @param {PaymentMethodOptionProps} props - Props for the payment method option
 * @param {React.ElementType} props.icon - The icon component to render (e.g. from iconsax-react)
 * @param {string} props.label - The name or label of the payment method.
 * @param {boolean} props.selected - Indicates if this option is currently selected (adds active border).
 * @returns {JSX.Element} - The rendered payment option box.
 *
 * @example
 * <PaymentMethodOption
 *   icon={CardIcon}
 *   label="Credit Card"
 *   selected={selectedMethod === 'card'}
 * />
 */

interface PaymentMethodOptionProps {
  icon: React.ElementType;
  label: string;
  selected: boolean;
  onSelect(): void;
}

export default function PaymentMethodOption({
  icon: Icon,
  label,
  selected,
  onSelect,
}: PaymentMethodOptionProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      borderRadius={"12px"}
      border="1px solid "
      maxHeight={"100px"}
      minWidth={"100px"}
      width={"100%"}
      padding={{ md: "24px", xs: "10px" }}
      gap="10px"
      sx={{ borderColor: selected ? "#FE645E" : "#E1E1E1", cursor: "pointer" }}
      onClick={onSelect}
    >
      <Icon size="24px" color="#292D32" />
      <Typography sx={{ sm: "15px", xs: "12px" }}>{label}</Typography>
    </Box>
  );
}
