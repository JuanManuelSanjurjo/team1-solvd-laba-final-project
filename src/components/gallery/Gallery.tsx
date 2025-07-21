"use client";
import Fade from "@mui/material/Fade";
import { useState, useRef, useEffect, JSX } from "react";
import { Box } from "@mui/material";
import ImageGalleryStack from "./ImageGalleryStack";
import ArrowButtons from "@/components/ArrowButtons";

type GalleryProps = {
  images: string[];
};

/**
 * Gallery
 *
 * This component is a gallery of images. It uses the ImageGalleryStack component to display the images in a stack layout.
 * It also uses the ArrowButtons component to display the previous and next buttons.
 *
 * @param images - An array of image URLs.
 * @returns {JSX.Element} with the gallery component.
 */

export default function Gallery({ images }: GalleryProps): JSX.Element {
  const [current, setCurrent] = useState(0);
  const thumbnailRefs = useRef<HTMLDivElement[] | []>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  useEffect(() => {
    if (!thumbnailRefs.current[current] || !containerRef.current) return;

    const thumbnail = thumbnailRefs.current[current];
    const container = containerRef.current;
    const isMobile = window.innerWidth < 900;

    if (isMobile) {
      const scrollLeftRaw =
        thumbnail.offsetLeft -
        container.clientWidth / 2 +
        thumbnail.offsetWidth / 2;

      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const scrollLeft = Math.max(0, Math.min(scrollLeftRaw, maxScrollLeft));

      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    } else {
      const scrollTopRaw =
        thumbnail.offsetTop -
        container.clientHeight / 2 +
        thumbnail.offsetHeight / 2;

      const maxScrollTop = container.scrollHeight - container.clientHeight;
      const scrollTop = Math.max(0, Math.min(scrollTopRaw, maxScrollTop));

      container.scrollTo({
        top: scrollTop,
        behavior: "smooth",
      });
    }
  }, [current]);

  return (
    <Box display="flex" sx={{ justifyContent: "center", alignItems: "center" }}>
      <Box
        m={0}
        display="flex"
        maxWidth={680}
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
        <ImageGalleryStack
          images={images}
          current={current}
          setCurrent={setCurrent}
          thumbnailRefs={thumbnailRefs}
          containerRef={containerRef}
        />

        <Box flex={1} position="relative" display="flex" flexDirection="column">
          <Fade in={true} key={images[current]} timeout={500}>
            <Box
              component="img"
              src={images[current]}
              alt={`main-img-${current}`}
              sx={{
                aspectRatio: {
                  xs: "4/3",
                },
                height: "100%",
                width: "100%",
                objectFit: "cover",
                borderRadius: 0,
              }}
            />
          </Fade>

          <ArrowButtons handleNext={handleNext} handlePrev={handlePrev} />
        </Box>
      </Box>
    </Box>
  );
}
