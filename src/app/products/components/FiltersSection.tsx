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
        // disable elevation + styling defaults
        TransitionProps={{ timeout: EXPAND_DELAY_MS }}
        sx={{
          boxShadow: "none",
          "&:before": { display: "none" },
          borderRadius: "0 !important",
          border: "none",
          backgroundColor: "transparent",

          // allow icons to render fully while height animates (prevent clipping)
          "& .MuiCollapse-root, & .MuiCollapse-wrapper, & .MuiCollapse-wrapperInner":
            {
              overflowInline: "visible",
            },

          // styles for our inner content container using a class name
          // When accordion is expanded, the selector `.Mui-expanded & .filtersInner` applies
          // NOTE: the `.MuiAccordion-root.Mui-expanded` structure means we target the inner
          // container via a nested selector below.
          "& .filtersInner": {
            opacity: 0,
            transform: "translateY(-6px)",
            pointerEvents: "none",
            transition: "opacity 160ms ease, transform 160ms ease",
            // no transition-delay by default (so it hides immediately on collapse)
            transitionDelay: "0ms",
          },

          // when accordion has the expanded class, we want the inner to appear,
          // but only AFTER the Collapse (height) animation completes — so we add a delay.
          // `.Mui-expanded` applies to the root Accordion, we then find the inner container.
          "&.Mui-expanded .filtersInner": {
            opacity: 1,
            transform: "translateY(0)",
            pointerEvents: "auto",
            // delay must be >= Collapse timeout to avoid the inner being visible while height animates
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
            // keep AccordionDetails itself visible so it doesn't clip children
            overflow: "visible",
          }}
        >
          {/* Inner wrapper that we animate/hide via CSS above */}
          <Box className="filtersInner">{children}</Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
