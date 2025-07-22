'use client';

import React from 'react';
import { Checkbox, Typography, Box } from '@mui/material';

interface FilterCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  count?: number;
}

const FilterCheckbox: React.FC<FilterCheckboxProps> = ({ label, checked, onChange, count }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Checkbox checked={checked} onChange={onChange} />
      <Typography
        variant="body1"
        sx={{
          ml: '12px',
          color: '#494949',
        }}
      >
        {label}
        {count !== undefined && (
          <>
            {' '}
            <Typography component="span" sx={{ fontWeight: 300, color: '#6e7278' }}>
              (+{count})
            </Typography>
          </>
        )}
      </Typography>
    </Box>
  );
};

export default FilterCheckbox;
