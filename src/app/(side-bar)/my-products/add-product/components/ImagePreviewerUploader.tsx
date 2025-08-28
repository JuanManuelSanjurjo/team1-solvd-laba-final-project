"use client";

import CardContainer from "@/components/cards/CardContainer";
import CardDragAndDrop from "@/components/cards/CardDragAndDrop";
import { Session } from "next-auth";
import { useState, useCallback, useEffect, useMemo } from "react";
import RemovableImage from "./RemovableImage";

interface ImagePreviewUploaderProps {
  session: Session | null;
  onFilesChange: (files: File[]) => void;
  initialPreviews?: string[];
  onPreviewsChange?: (previews: string[]) => void;
  reset?: boolean;
}

type Preview = { url: string; file?: File };

/**
 * Individual preview.
 * - `url` is either a remote image URL or a `createObjectURL` blob URL created for a newly added file.
 * - `file` is present only for newly added files and contains the File object to upload.
 */
/**
 * Props for the ImagePreviewerUploader component.
 * @property {Session | null} session - NextAuth session (optional). Included for parity with callers; not currently used inside the component but kept for future needs.
 * @property {(files: File[]) => void} onFilesChange - Callback invoked whenever the list of new File objects (files just added by the user) changes.
 * @property {string[]} initialPreviews - Optional list of initial (existing) image URLs to display as previews when the component mounts.
 * @property {(previews: string[]) => void} onPreviewsChange - Optional callback invoked when the list of remaining existing preview URLs changes (for example when a user deletes an existing image preview).
 * @property {boolean} reset - If true, clears all previews.
 */
export default function ImagePreviewerUploader({
  onFilesChange,
  initialPreviews = [],
  onPreviewsChange,
  reset,
}: ImagePreviewUploaderProps) {
  const [previews, setPreviews] = useState<Preview[]>(
    initialPreviews.map((url) => ({ url }))
  );

  const stableOnPreviewsChange = useMemo(() => {
    return onPreviewsChange ?? (() => {});
  }, [onPreviewsChange]);

  useEffect(() => {
    const newFiles = previews.filter((p) => p.file).map((p) => p.file as File);
    const remainingUrls = previews.filter((p) => !p.file).map((p) => p.url);

    onFilesChange(newFiles);
    stableOnPreviewsChange(remainingUrls);
  }, [previews, onFilesChange, stableOnPreviewsChange]);

  useEffect(() => {
    if (reset) setPreviews([]);
  }, [reset]);

  /**
   * Handle an incoming file (from drag-and-drop or file input).
   * Creates a blob URL for previewing the file and appends a Preview entry.
   * @param {File} file- Incoming file.
   */
  const handleAddFile = useCallback((file: File) => {
    const objectUrl = URL.createObjectURL(file);
    const newPreview: Preview = { url: objectUrl, file };

    setPreviews((prev) => [...prev, newPreview]);
  }, []);

  /**
   * Remove a preview by index. The parent will be informed of the updated lists via the effect above.
   *
   * If the preview removed is backed by a `File` (i.e. a blob URL), the component should revoke the URL to free memory.
   * The current implementation does not revoke URLs — consider calling `URL.revokeObjectURL(preview.url)` here when `preview.file` is present.
   *
   * @param {number} index - Index of the preview to remove.
   */
  const handleDeletePreview = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
  };
  return (
    <CardContainer>
      <CardDragAndDrop onFileAdd={handleAddFile} />
      {previews.map((preview, idx) => (
        <RemovableImage
          key={idx}
          image={preview.url}
          overlayAction="cardOverlayDelete"
          onDeletePreview={() => handleDeletePreview(idx)}
        />
      ))}
    </CardContainer>
  );
}
