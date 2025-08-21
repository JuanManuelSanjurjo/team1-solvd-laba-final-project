"use client";

import Card from "@/components/cards/Card";
import CardContainer from "@/components/cards/CardContainer";
import CardDragAndDrop from "@/components/cards/CardDragAndDrop";
import { Session } from "next-auth";
import { useState, useCallback, useEffect, useMemo } from "react";

/**
 * Props for the ImagePreviewerUploader component.
 * @property {function} onFilesChange - Callback triggered whenever files are added. Receives the current list of selected files.
 */
interface ImagePreviewUploaderProps {
  session: Session | null;
  onFilesChange: (files: File[]) => void;
  initialPreviews?: string[];
  onPreviewsChange?: (previews: string[]) => void;
  reset?: boolean;
}

/**
 * A component that allows users to upload images via drag-and-drop,
 * generates image previews, and passes the selected files to a parent component.
 *
 * @component
 * @param {ImagePreviewUploaderProps} props - The props object.
 * @returns {JSX.Element} The rendered component.
 */
type Preview = { url: string; file?: File };

export default function ImagePreviewerUploader({
  session,
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

  const handleAddFile = useCallback((file: File) => {
    const objectUrl = URL.createObjectURL(file);
    const newPreview: Preview = { url: objectUrl, file };

    setPreviews((prev) => [...prev, newPreview]);
  }, []);
  const handleDeletePreview = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
  };
  return (
    <CardContainer>
      <CardDragAndDrop onFileAdd={handleAddFile} />
      {previews.map((preview, idx) => (
        <Card
          session={session}
          key={idx}
          image={preview.url}
          overlayAction="cardOverlayDelete"
          onDeletePreview={() => handleDeletePreview(idx)}
          showText={false}
        />
      ))}
    </CardContainer>
  );
}
