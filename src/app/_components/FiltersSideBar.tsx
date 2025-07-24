'use client';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterCheckbox from '@/components/FilterCheckBox';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import { SearchBar } from '@/components/SearchBar';

export const FilterSideBar: React.FC = () => {
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '320px' }}>
        <Box sx={{ width: '100%', paddingLeft: '40px', borderBottom: '1px solid #eaecf0' }}>
          <Accordion
            sx={{
              boxShadow: 'none', // Removes shadow
              '&:before': {
                display: 'none', // Removes the default divider line
              },
              borderRadius: '0 !important', // Force no radius
              border: 'none', // Remove border
              backgroundColor: 'transparent', // Optional: remove background color
            }}
          >
            <AccordionSummary
              sx={{
                padding: 0,
                '& .MuiAccordionSummary-expandIconWrapper': {},
              }}
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography fontWeight={500}>Gender</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0, margin: 0 }}>
              <FilterCheckbox label="Men" checked={false} onChange={() => {}} />
              <FilterCheckbox label="Woman" checked={false} onChange={() => {}} />
            </AccordionDetails>
          </Accordion>
        </Box>
        <Box sx={{ width: '100%', paddingLeft: '40px', borderBottom: '1px solid #eaecf0' }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Kids</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FilterCheckbox label="Boys" checked={false} onChange={() => {}} />
              <FilterCheckbox label="Girls" checked={false} onChange={() => {}} />
            </AccordionDetails>
          </Accordion>
        </Box>
        <Box sx={{ width: '100%', paddingLeft: '40px', borderBottom: '1px solid #eaecf0' }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Brand</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <SearchBar size="small" />
              <FilterCheckbox label="Adidas" checked={false} onChange={() => {}} />
              <FilterCheckbox label="Asics" checked={false} onChange={() => {}} />
              <FilterCheckbox label="New Balance" checked={false} onChange={() => {}} />
              <FilterCheckbox label="Nike" checked={false} onChange={() => {}} />
              <FilterCheckbox label="Puma" checked={false} onChange={() => {}} />
              <FilterCheckbox label="Reebok" checked={false} onChange={() => {}} />
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    </>
  );
};
