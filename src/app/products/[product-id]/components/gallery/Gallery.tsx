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
    <Box
      display="flex"
      sx={{ justifyContent: "center", alignItems: "center", width: "100%" }}
    >
      <Box
        m={0}
        display="flex"
        width="100%"
        maxWidth={680}
        maxHeight="auto"
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

        <Box
          flex={1}
          position="relative"
          display="flex"
          flexDirection="column"
          sx={{
            width: {
              xs: "100%",
              md: "588px",
            },
            height: {
              xs: "100%",
              md: "630px",
            },
          }}
        >
          <Fade in={true} key={images[current].url} timeout={500}>
            <Box
              component="img"
              src={images[current].url}
              alt={`main-img-${current}`}
              sx={{
                aspectRatio: {
                  xs: "1/1",
                  md: "4/3",
                },
                width: {
                  xs: "100%",
                  md: "588px",
                },
                height: {
                  xs: "100%",
                  md: "630px",
                },
                maxHeight: {
                  xs: "100%",
                  md: "630px",
                },
                maxWidth: {
                  xs: "100%",
                  md: "588px",
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
