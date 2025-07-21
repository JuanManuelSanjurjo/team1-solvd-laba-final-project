import { Box, IconButton } from "@mui/material";
import { JSX } from "react";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

/**
 * ArrowButtons
 *
 * This component is a container for two buttons that control the gallery.
 *
 * @param handleNext - A function to handle the next button click.
 * @param handlePrev - A function to handle the previous button click.
 * @returns {JSX.Element} with the arrow buttons component.
 */

type ArrowButtonsProps = {
  handlePrev: () => void;
  handleNext: () => void;
};

export default function ArrowButtons({
  handleNext,
  handlePrev,
}: ArrowButtonsProps): JSX.Element {
  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      p={1}
      gap={2}
      position="absolute"
      bottom={24}
      right={32}
    >
      <IconButton
        onClick={handlePrev}
        sx={{
          bgcolor: "white",
          "&:hover": { bgcolor: "gray" },
          width: 24,
          height: 24,
        }}
      >
        <ArrowBackIosNewRoundedIcon
          fontSize="medium"
          sx={{ width: "0.4rem", height: "0.7rem", color: "black" }}
        />
      </IconButton>
      <IconButton
        onClick={handleNext}
        sx={{
          bgcolor: "white",
          "&:hover": { bgcolor: "gray" },
          width: 24,
          height: 24,
        }}
      >
        <ArrowForwardIosRoundedIcon
          sx={{ width: "0.4rem", height: "0.7rem", color: "black" }}
        />
      </IconButton>
    </Box>
  );
}
