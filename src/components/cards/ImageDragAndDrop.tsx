"use client";
import { useState, useRef, JSX, ChangeEvent, DragEvent } from "react";
import { Box, Typography, Link } from "@mui/material";
import { Gallery } from "iconsax-react";

/**
 * ImageDragAndDrop
 *
 * This component is a drag and drop area for images. It displays a gallery icon and a text indicating whether to drop the image or click to browse.
 *
 * @returns {JSX.Element} with the image drag and drop component.
 */

export default function ImageDragAndDrop(): JSX.Element {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  // Process file
  const processFile = (file: File) => {
    console.log("placeholder for actual feature", file);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  };

  return (
    <Box
      component="div"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      sx={{
        backgroundColor: isDragging ? "rgba(0, 0, 0, 0.05)" : "transparent",
        borderColor: isDragging ? "#1976d2" : "#5C5C5C",
        width: {
          xs: 150,
          md: 320,
        },
        height: {
          xs: 170,
          md: 305,
        },
        borderRadius: 2,
        border: "1px dashed #5C5C5C",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        cursor: "pointer",
        textAlign: "center",
        transition: "border-color 0.3s",
        "&:hover": {
          borderColor: "#555",
        },
      }}
    >
      <input
        type="file"
        accept="image/*"
        hidden
        ref={inputRef}
        onChange={handleFileChange}
      />

      <Gallery size="36" color={isDragging ? "#fe645e" : "#6E7278"} />
      <Typography variant="caption" sx={{ px: 2 }}>
        {isDragging ? (
          "Drop your image here"
        ) : (
          <>
            Drop your image here or{" "}
            <Link component="button" underline="always">
              click to browse
            </Link>
          </>
        )}
      </Typography>
    </Box>
  );
}
