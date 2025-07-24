'use client';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterCheckbox from '@/components/FilterCheckBox';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import { SearchBar } from '@/components/SearchBar';

export const FiltersSection: React.FC = () => {
  return (
    <>
      <Box sx={{ width: '100%', paddingLeft: '40px', borderBottom: '1px solid #eaecf0' }}>
        <Accordion
          sx={{
            boxShadow: 'none',
            '&:before': {
              display: 'none',
            },
            borderRadius: '0 !important',
            border: 'none',
            backgroundColor: 'transparent',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              margin: 0,
              padding: 0,
            }}
          >
            <Typography>Gender</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FilterCheckbox label="Men" checked={false} onChange={() => {}} />
            <FilterCheckbox label="Woman" checked={false} onChange={() => {}} />
          </AccordionDetails>
        </Accordion>
      </Box>
    </>
  );
};
