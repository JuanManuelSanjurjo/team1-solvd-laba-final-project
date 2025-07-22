import React from 'react';
import { Avatar } from '@mui/material';

interface ProfilePictureProps {
  src: string;
  alt?: string;
  width: number;
}

export const ProfilePicture: React.FC<ProfilePictureProps> = ({
  src,
  alt = 'Profile picture',
  width,
}) => {
  return (
    <Avatar
      src={src}
      alt={alt}
      sx={{
        width,
        height: width,
      }}
    />
  );
};
