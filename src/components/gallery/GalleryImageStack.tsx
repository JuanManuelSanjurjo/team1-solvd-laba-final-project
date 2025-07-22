import { Box, Stack } from "@mui/material";
import { JSX } from "react";

type ImageGalleryStackProps = {
  images: string[];
  setCurrent: (index: number) => void;
  current: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  thumbnailRefs: React.RefObject<HTMLDivElement[] | []>;
};

/**
 * GalleryImageStack
 *
 * This component is a stack of thumbnails that display images.
 * It uses the Box component to create each thumbnail and the Stack component to arrange them in a stack layout.
 * Mobile version changes to a queue layout.
 *
 * @param images - An array of image URLs.
 * @param setCurrent - A function to set the current index of the gallery.
 * @param current - The index of the current image in the gallery.
 * @param containerRef - A reference to the container element of the gallery.
 * @param thumbnailRefs - An array of references to the thumbnail elements of the gallery.
 * @returns {JSX.Element} with the image gallery stack component.
 */

export default function GalleryImageStack({
  images,
  setCurrent,
  current,
  containerRef,
  thumbnailRefs,
}: ImageGalleryStackProps): JSX.Element {
  return (
    <Stack
      ref={containerRef}
      sx={{
        width: {
          sx: "100%",
          md: 75,
        },
        maxHeight: "100%",
        maxWidth: "100%",
        padding: {
          xs: "8px 0",
          md: "0 8px",
        },
        overflow: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        gap: 1,
        flexDirection: {
          xs: "row",
          md: "column",
        },
      }}
    >
      {images.map((src, index) => (
        <Box
          key={index}
          ref={(el: HTMLDivElement | null) => {
            if (el) thumbnailRefs.current[index] = el;
          }}
          onClick={() => setCurrent(index)}
          sx={{
            position: "relative",
            cursor: "pointer",
            width: 75,
            height: 75,
            aspectRatio: "1/1",
            border:
              index === current ? "2px solid #fe645e" : "2px solid transparent",
            boxShadow: index === current ? 2 : 0,
            transition: "border 0.3s",
            "&::after":
              index === current
                ? {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    bgcolor: "rgba(0,0,0,0.5)",
                    opacity: 1,
                    transition: "opacity 0.3s",
                    zIndex: 1,
                  }
                : null,
            "&:hover": {
              opacity: 0.5,
              transition: "opacity 0.2s",
            },
          }}
        >
          <Box
            component="img"
            src={src}
            alt={`img-${index}`}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>
      ))}
    </Stack>
  );
}
