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

export const FiltersSection: React.FC<FilterSectionProps> = ({
  label,
  children,
}) => {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          paddingLeft: { xs: "30px", sm: "40px" },
          borderBottom: "1px solid #eaecf0",
        }}
      >
        <Accordion
          sx={{
            boxShadow: "none",
            "&:before": {
              display: "none",
            },
            borderRadius: "0 !important",
            border: "none",
            backgroundColor: "transparent",
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
            sx={{ padding: 0, margin: 0, paddingBottom: "28px" }}
          >
            {children}
          </AccordionDetails>
        </Accordion>
      </Box>
    </>
  );
};
