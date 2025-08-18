import { Typography, Box, styled } from "@mui/material";
import { Add } from "iconsax-react";

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "rgba(150, 150, 150, 0.1)",
  padding: "2px 6px",
  color: theme.palette.text.secondary,
  borderRight: "2px solid rgba(0, 0, 0, 0.1)",
  wordBreak: "keep-all",
  borderRadius: 4,
  cursor: "pointer",
}));

type FilterChipProps = {
  text: string;
  onClick: () => void;
};

export default function FilterChip({ text, onClick }: FilterChipProps) {
  return (
    <StyledBox onClick={onClick}>
      <Typography variant="caption">{text}</Typography>
      <Add
        color="rgba(92, 92, 92, 1)"
        size={14}
        style={{ transform: "rotate(45deg)", cursor: "pointer" }}
      />
    </StyledBox>
  );
}
