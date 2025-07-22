'use client';

import React from 'react';
import { Checkbox, Typography, Box } from '@mui/material';

/**
 * FilterCheckbox component renders a checkbox with a label and an optional count.
 *
 * Commonly used in filter panels to allow users to toggle filters on or off.
 * If a `count` is provided, it is displayed next to the label in a lighter style.
 *
 * @component
 * @example
 * ```tsx
 * <FilterCheckbox
 *   label="Red"
 *   checked={true}
 *   onChange={(e) => console.log(e.target.checked)}
 *   count={24}
 * />
 * ```
 *
 * @param {Object} props - Component props
 * @param {string} props.label - The text label displayed next to the checkbox.
 * @param {boolean} props.checked - Determines whether the checkbox is checked.
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} props.onChange - Callback fired when the checkbox value is changed.
 * @param {number} [props.count] - Optional count displayed next to the label, typically representing the number of items matching the filter.
 *
 * @returns {JSX.Element} The rendered checkbox with label and optional count.
 */

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
