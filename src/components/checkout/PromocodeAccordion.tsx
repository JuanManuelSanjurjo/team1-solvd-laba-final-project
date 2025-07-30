import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";

import { ArrowDown2 } from "iconsax-react";

import Input from "../FormElements/Input";
import Button from "../Button";

const PromocodeAccordion = () => {
  return (
    <>
      <Accordion
        sx={{
          boxShadow: "none",
          background: "none",
          width: "fit-content",
          marginBottom: "1rem",
        }}
      >
        <AccordionSummary
          sx={{
            fontSize: "20px",
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
            alignItems: "end",
            gap: "1rem",
            padding: "0",
          }}
        >
          <Input
            name="promocode"
            placeholder="CODE123"
            errorMessage=""
            label="Promocode"
          />{" "}
          <Button variant="contained">Apply</Button>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default PromocodeAccordion;
