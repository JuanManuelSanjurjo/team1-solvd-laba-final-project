"use client";

import { Box, Paper, Rating, Typography } from "@mui/material";
import NavigationArrows, {
  NavigationArrowsProps,
} from "@/components/NavigationArrows";
import { JSX, useEffect, useState } from "react";
import { testimonials } from "@/mocks/testimonials";
/**
 * Testimonials component displays a user testimonial with rating and navigation arrows.
 *
 * It is styled with a frosted glass effect and is centered in its container.
 *
 * @component
 * @param {Object} props - Component props
 * @param {NavigationArrowsProps["variant"]} [props.variant] - Optional variant type for navigation arrows
 * @returns {JSX.Element}
 *
 * @example
 * <Testimonials variant="rounded" />
 */
export default function Testimonials({
  variant,
}: Pick<NavigationArrowsProps, "variant">): JSX.Element {
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const handleNext = () => {
    setTestimonialIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    setTestimonialIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) =>
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: "absolute",
        top: "60%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "75%",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          border: "2px solid rgba(255, 255, 255, 0.83)",
          padding: "3em",
          background: `radial-gradient(
            64.9% 185.04% at 19.81% 27.89%,
            rgba(255, 255, 255, 0.42) 0%,
            rgba(255, 255, 255, 0.06) 100%
          )`,
          backdropFilter: "blur(24px)",
          borderRadius: "32px",
          color: "#0D0D0D",
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Typography
            sx={{
              fontSize: { sm: "16px", md: "20px", lg: "22px", xl: "25px" },
            }}
          >
            {testimonials[testimonialIndex].testimonial}
          </Typography>
          <NavigationArrows
            handleNext={handleNext}
            handlePrev={handlePrev}
            variant={variant}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            margin: "16px 0 0 0",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: "600",
              display: "inline",
              marginRight: "10px",
            }}
          >
            {testimonials[testimonialIndex].clientName}
          </Typography>
          <Rating
            name="read-only"
            size="small"
            value={testimonials[testimonialIndex].stars}
            readOnly
          />
        </Box>
        <Typography sx={{ display: "block", color: "#797979" }}>
          {testimonials[testimonialIndex].countryCity}
        </Typography>
      </Paper>
    </Box>
  );
}
