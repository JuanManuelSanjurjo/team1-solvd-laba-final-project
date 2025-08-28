import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";

import { ArrowDown2 } from "iconsax-react";
import Input from "@/components/form-elements/Input";
import Button from "@/components/Button";

/**
 * Accordion component for entering and applying a promocode.
 * Displays a collapsible section with an input field and apply button.
 *
 * @component
 * @returns {JSX.Element} A styled accordion section for promocode input.
 */
const PromocodeAccordion = () => {
  return (
    <>
      <Accordion
        sx={{
          boxShadow: "none",
          background: "none",
          width: { xs: "100%", sm: "fit-content" },
          marginBottom: "1rem",
        }}
      >
        <AccordionSummary
          sx={{
            fontSize: {
              xs: "16px",
              sm: "20px",
            },
            display: "flex",
            gap: "6px",
            padding: "0",
          }}
          expandIcon={<ArrowDown2 size="12" color="black" />}
        >
          Do you have a promocode?
        </AccordionSummary>
        <AccordionDetails
          sx={{
            display: "flex",
            width: { xs: "100%" },
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            alignItems: "end",
            justifyContent: "flex",
            gap: "1rem",
            padding: "0",
          }}
        >
          <Input
            fullWidth
            name="promocode"
            placeholder="CODE123"
            errorMessage=""
            label="Promocode"
          />{" "}
          <Button variant="outlined">Apply</Button>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default PromocodeAccordion;
