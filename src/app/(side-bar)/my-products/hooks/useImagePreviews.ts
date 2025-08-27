import { useState } from "react";

export type Preview = { url: string; file?: File };
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
