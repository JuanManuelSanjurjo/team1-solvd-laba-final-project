import { useState } from "react";

export type Preview = { url: string; file?: File };

/**
 * Hook: useImagePreviews
 *
 * Manages local state for image previews split into two buckets: new `File` objects and existent remote URLs.
 * Useful for forms that need to upload newly added files while keeping track of which remote images were left unchanged.
 *
 * @param {string[]} [initialUrls=[]] - Optional initial remote image URLs to seed `existentImages`.
 * @returns {object} An object exposing:
 * - `imageFiles` (File[]) and `setImageFiles`
 * - `existentImages` (string[]) and `setExistentImages`
 * - `reset()` to clear both lists
 * - `getNewFiles()` returns the current File[] to upload
 * - `getRemainingUrls()` returns the current existent image URLs
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
