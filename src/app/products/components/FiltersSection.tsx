"use client";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";

interface FilterSectionProps {
  label: string;
  children: React.ReactNode;
}

/**
 * Behaviour:
 * - Keep Collapse wrappers overflow: visible so checkbox svg won't be clipped.
 * - Wrap the children in `.filtersInner` which:
 *    - is invisible (opacity 0, translateY) initially,
 *    - fades/slides in AFTER the Accordion expansion finishes (using transition-delay).
 *    - fades out IMMEDIATELY on collapse (no delay).
 *
 * - We align the delay with the Collapse transition timeout below (200ms). If you change
 *   TransitionProps.timeout, update the `EXPAND_DELAY_MS` constant.
 */
export const FiltersSection: React.FC<FilterSectionProps> = ({
  label,
  children,
}) => {
  // match this with Collapse animation / TransitionProps.timeout
  const EXPAND_DELAY_MS = 200;

  return (
    <Box
      sx={{
        width: "100%",
        paddingLeft: { xs: "30px", sm: "40px" },
        borderBottom: "1px solid #eaecf0",
      }}
    >
      <Accordion
        TransitionProps={{ timeout: EXPAND_DELAY_MS }}
        sx={{
          boxShadow: "none",
          "&:before": { display: "none" },
          borderRadius: "0 !important",
          border: "none",
          backgroundColor: "transparent",

          "& .MuiCollapse-root, & .MuiCollapse-wrapper, & .MuiCollapse-wrapperInner":
            {
              overflowInline: "visible",
            },

          "& .filtersInner": {
            opacity: 0,
            transform: "translateY(-6px)",
            pointerEvents: "none",
            transition: "opacity 160ms ease, transform 160ms ease",
            transitionDelay: "0ms",
          },

          "&.Mui-expanded .filtersInner": {
            opacity: 1,
            transform: "translateY(0)",
            pointerEvents: "auto",
            transitionDelay: `${EXPAND_DELAY_MS}ms`,
          },
        }}
      >
        <AccordionSummary
          sx={{
            padding: 0,
            "& .MuiAccordionSummary-expandIconWrapper": {
              paddingRight: { xs: "14px", sm: "4px" },
            },
            ".Mui-expanded &": {
              paddingRight: { xs: "14px", sm: "4px" },
            },
          }}
          expandIcon={<ExpandMoreIcon sx={{ color: "black" }} />}
        >
          <Typography fontWeight={500}>{label}</Typography>
        </AccordionSummary>

        <AccordionDetails
          sx={{
            padding: 0,
            margin: 0,
            paddingBottom: "28px",
            overflow: "visible",
          }}
        >
          <Box className="filtersInner">{children}</Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
