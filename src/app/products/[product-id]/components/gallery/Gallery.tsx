"use client";

import Fade from "@mui/material/Fade";
import { useState, useRef, useEffect, JSX } from "react";
import { Box } from "@mui/material";
import GalleryImageStack from "./GalleryImageStack";
import NavigationArrows from "@/components/NavigationArrows";
import { NormalizedImage } from "@/types/product-types";

/**
 * Gallery
 *
 * This component is a gallery of images. It uses the GalleryImageStack component to display the images in a stack layout (queue in mobile).
 * Also uses the NavigationArrows component to display the previous and next buttons.
 *
 * @param images - An array of image URLs.
 * @returns {JSX.Element} with the gallery component.
 */

export default function Gallery({
  images,
}: {
  images: NormalizedImage[];
}): JSX.Element {
  const [current, setCurrent] = useState(0);
  const thumbnailRefs = useRef<HTMLDivElement[] | []>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  function handlePrev() {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  }

  function handleNext() {
    setCurrent((prev) => (prev + 1) % images.length);
  }

  useEffect(() => {
    const thumbnail = thumbnailRefs.current[current];
    if (thumbnail) {
      thumbnail.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [current]);

  return (
    <Box display="flex" sx={{ justifyContent: "center", alignItems: "center" }}>
      <Box
        m={0}
        display="flex"
        maxWidth={{ xs: "100%", md: 680 }}
        maxHeight={630}
        boxShadow={0}
        sx={{
          aspectRatio: "1/0.9",
          flexDirection: {
            xs: "column-reverse",
            md: "row",
          },
          gap: 1,
        }}
      >
        <GalleryImageStack
          images={images}
          current={current}
          setCurrent={setCurrent}
          thumbnailRefs={thumbnailRefs}
          containerRef={containerRef}
        />

        <Box flex={1} position="relative" display="flex" flexDirection="column">
          <Fade in={true} key={images[current].url} timeout={500}>
            <Box
              component="img"
              src={images[current].url}
              alt={`main-img-${current}`}
              sx={{
                aspectRatio: {
                  xs: "4/3",
                },
                height: {
                  xs: "100%",
                  lg: "630px",
                },
                width: {
                  xs: "100%",
                  lg: "588px",
                },
                objectFit: "cover",
                borderRadius: 0,
              }}
            />
          </Fade>
          <NavigationArrows
            variant="product_card"
            handleNext={handleNext}
            handlePrev={handlePrev}
          />
        </Box>
      </Box>
    </Box>
  );
}
