"use client";

import Card from "@/components/cards/Card";
import CardContainer from "@/components/cards/CardContainer";
import CardDragAndDrop from "@/components/cards/CardDragAndDrop";
import { useState, useCallback } from "react";

interface ImagePreviewUploaderProps {
  onFilesChange: (files: File[]) => void;
}

export default function ImagePreviewerUploader({
  onFilesChange,
}: ImagePreviewUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

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

  return (
    <CardContainer>
      <CardDragAndDrop onFileAdd={handleAddFile} />
      {previews.map((url, idx) => (
        <Card
          key={idx}
          image={url}
          overlayAction="cardOverlayDelete"
          showText={false}
        />
      ))}
    </CardContainer>
  );
}
