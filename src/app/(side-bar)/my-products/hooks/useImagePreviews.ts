import { useState, useEffect } from "react";

export type Preview = { url: string; file?: File };

export function useImagePreviews(initialUrls: string[] = []) {
  // files created by the preview component (File objects)
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  // urls of existent images (from product.images url list)
  const [existentImages, setExistentImages] = useState<string[]>(
    initialUrls ?? []
  );

  // If initialUrls changes externally we sync the existentImages.
  useEffect(() => {
    setExistentImages(initialUrls ?? []);
  }, [initialUrls?.length]); // depend on length to avoid object identity thrash

  const reset = () => {
    setImageFiles([]);
    setExistentImages([]);
  };

  // Helpers used by forms:
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
