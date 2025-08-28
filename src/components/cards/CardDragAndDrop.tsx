"use client";
import { useState, useRef, JSX, ChangeEvent, DragEvent } from "react";
import { Box, Typography, Link } from "@mui/material";
import { Gallery } from "iconsax-react";

/**
 * CardDragAndDrop
 *
 * This component is a drag and drop area for images. It displays a gallery icon and a text indicating whether to drop the image or click to browse.
 *
 * @returns {JSX.Element} with the image drag and drop component.
 */

interface CardDragAndDropProps {
  onFileAdd: (file: File) => void;
}

/**
 * CardDragAndDrop component that displays a drag and drop area for images.
 *
 * @component
 * @param {CardDragAndDropProps} props - Props for the component
 * @param {function} props.onFileAdd - Function to call when a file is added.
 * @returns {JSX.Element} The rendered card drag and drop component
 */
export default function CardDragAndDrop({
  onFileAdd,
}: CardDragAndDropProps): JSX.Element {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => inputRef.current?.click();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files?.length) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith("image/")) {
          onFileAdd(files[i]);
        }
      }
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files || []);
    dropped.forEach((file) => {
      if (file.type.startsWith("image/")) {
        onFileAdd(file);
      }
    });
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
