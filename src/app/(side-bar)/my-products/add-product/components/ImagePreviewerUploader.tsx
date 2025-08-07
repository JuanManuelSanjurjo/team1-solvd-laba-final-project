"use client";

import Card from "@/components/cards/Card";
import CardContainer from "@/components/cards/CardContainer";
import CardDragAndDrop from "@/components/cards/CardDragAndDrop";
import { useState, useCallback, useEffect } from "react";

/**
 * Props for the ImagePreviewerUploader component.
 * @property {function} onFilesChange - Callback triggered whenever files are added. Receives the current list of selected files.
 */
interface ImagePreviewUploaderProps {
  onFilesChange: (files: File[]) => void;
  initialPreviews?: string[];
  onPreviewsChange?: (previews: string[]) => void;
}

/**
 * A component that allows users to upload images via drag-and-drop,
 * generates image previews, and passes the selected files to a parent component.
 *
 * @component
 * @param {ImagePreviewUploaderProps} props - The props object.
 * @returns {JSX.Element} The rendered component.
 */

export default function ImagePreviewerUploader({
  onFilesChange,
  initialPreviews = [],
  onPreviewsChange = () => {},
}: ImagePreviewUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(initialPreviews);

  useEffect(() => {
    onPreviewsChange(previews);
  }, [previews, onPreviewsChange]);

  const handleAddFile = useCallback(
    (file: File) => {
      const newFiles = [...files, file];
      setFiles(newFiles);
      onFilesChange(newFiles);

      const objectUrl = URL.createObjectURL(file);
      setPreviews((prev) => [...prev, objectUrl]);
    },
    [files, onFilesChange]
  );

  const handleDeletePreview = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    const newFiles = files.filter((_, i) => {
      return i !== index;
    });

    setPreviews(newPreviews);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  return (
    <CardContainer>
      <CardDragAndDrop onFileAdd={handleAddFile} />
      {previews.map((url, idx) => (
        <Card
          key={idx}
          image={url}
          overlayAction="cardOverlayDelete"
          onDeletePreview={() => handleDeletePreview(idx)}
          showText={false}
        />
      ))}
    </CardContainer>
  );
}
