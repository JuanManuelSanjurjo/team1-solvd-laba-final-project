"use client";
import { Avatar, Box, Tooltip } from "@mui/material";

/**
 * ProfilePicture component renders a circular avatar using the given image source.
 *
 * It uses MUI's `Avatar` component and sets both the width and height to create a square image,
 * which MUI styles as a circle by default.
 *
 * @component
 * @example
 *
 * <ProfilePicture
 *   src="www.coolavatarbystrapi.com/images/upload/1.jpg"
 *   alt="User avatar"
 *   width={40}
 * />
 *
 *
 * @param {Object} props - Component props
 * @param {string} props.src - The URL of the image to display inside the avatar.
 * @param {string} [props.alt='Profile picture'] - Alternative text for the avatar image.
 * @param {number} props.width - The width and height (in pixels) of the avatar. The avatar is always square.
 *
 * @returns {JSX.Element} A circular avatar displaying the provided image.
 */

interface ProfilePictureProps {
  border?: boolean;
  src: string;
  alt?: string;
  width: number | object;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

export const ProfilePicture: React.FC<ProfilePictureProps> = ({
  border = false,
  src,
  alt = "Profile picture",
  width,
  onClick,
}: ProfilePictureProps) => {
  return (
    <Box onClick={onClick}>
      <Tooltip title={alt}>
        <Avatar
          src={src}
          alt={alt}
          sx={{
            width,
            height: width,
            cursor: "pointer",
            border: border ? "5px solid white" : "none",
            backgroundColor: "white",
          }}
        />
      </Tooltip>
    </Box>
  );
};
