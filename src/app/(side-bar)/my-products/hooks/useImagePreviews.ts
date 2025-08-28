import { useState } from "react";

export type Preview = { url: string; file?: File };

/**
 * useImagePreviews
 *
 * This hook handles the preview of image files and their URLs.
 * It allows adding new image files, removing existing ones, and resetting the state.
 *
 * @component
 *
 * @param {string[]} initialUrls - The initial URLs of the images
 * @returns {Object} The image preview state and functions
 */
export function useImagePreviews(initialUrls: string[] = []) {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existentImages, setExistentImages] = useState<string[]>(
    () => initialUrls ?? []
  );

  const reset = () => {
    setImageFiles([]);
    setExistentImages([]);
  };

  const getNewFiles = () => imageFiles;
  const getRemainingUrls = () => existentImages;

  return {
    imageFiles,
    setImageFiles,
    existentImages,
    setExistentImages,
    reset,
    getNewFiles,
    getRemainingUrls,
  };
}
