import React from 'react';
import { Box, InputBase } from '@mui/material';
import { SearchNormal } from 'iconsax-react';

type SearchBarSize = 'large' | 'medium' | 'small' | 'xsmall';

interface SearchBarProps {
  placeholder?: string;
  size?: SearchBarSize;
  fullWidth?: boolean;
}

const sizeStyles = {
  large: {
    height: 79,
    fontSize: 24,
    iconSize: 27,
    paddingX: 4,
    width: '60%',
  },
  medium: {
    height: 48,
    fontSize: 18,
    iconSize: 20,
    paddingX: 2.5,
    width: 320,
  },
  small: {
    height: 32,
    fontSize: 14,
    iconSize: 16,
    paddingX: 2,
    width: 215,
  },
  xsmall: {
    height: 25,
    fontSize: 12,
    iconSize: 14,
    paddingX: 1.5,
    width: 290,
  },
};

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search',
  size = 'large',
  fullWidth = false,
}) => {
  const style = sizeStyles[size];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: fullWidth ? '100%' : style.width,
        height: style.height,
        borderRadius: '999px',
        border: '1px solid #494949',
        px: style.paddingX,
      }}
    >
      <SearchNormal style={{ width: style.iconSize, marginRight: 12 }} color="#494949" />
      <InputBase
        placeholder={placeholder}
        sx={{
          flex: 1,
          fontSize: style.fontSize,
          color: 'text.secondary',
        }}
      />
    </Box>
  );
};
