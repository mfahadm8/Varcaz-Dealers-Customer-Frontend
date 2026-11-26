import React, { useId, useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import { FileDropZone } from "./FileDropZone";
import { FileUploadList } from "./FileUploadList";
import type { FileUploadItem, FileUploadProps } from "./types";
import { createUploadItem, validateFileSize } from "./utils";

function preventDefaults(event: React.DragEvent) {
  event.preventDefault();
  event.stopPropagation();
}

const FileUpload: React.FC<FileUploadProps> = ({
  label = "Upload files",
  description = "Drag and drop files here or click to browse",
  accept,
  multiple = false,
  maxSize = 50,
  onChange,
  onError,
  onRemoveItem,
  className,
  showProgress = true,
  supportedFormats = "Supported formats: MP3, WAV, TXT, PDF, DOCX",
  items,
  disabled = false,
  inputId,
}) => {
  const generatedId = useId();
  const resolvedInputId = inputId ?? `file-upload-${generatedId}`;
  const [isDragging, setIsDragging] = useState(false);
  const [localItems, setLocalItems] = useState<FileUploadItem[]>([]);
  const renderedItems = useMemo(() => items ?? localItems, [items, localItems]);

  const removeItem = (item: FileUploadItem) => {
    if (!items) setLocalItems((prev) => prev.filter((entry) => entry.id !== item.id));
    onRemoveItem?.(item);
  };

  const processFiles = (fileList: FileList | null) => {
    if (!fileList || disabled) return;

    const nextItems: FileUploadItem[] = [];
    const validFiles: File[] = [];

    Array.from(fileList).forEach((file) => {
      const sizeError = validateFileSize(file, maxSize);
      if (sizeError) {
        onError?.(sizeError);
        nextItems.push({
          ...createUploadItem(file),
          status: "error",
          progress: 0,
          error: `Exceeds maximum size of ${maxSize}MB`,
        });
        return;
      }
      validFiles.push(file);
      nextItems.push(createUploadItem(file));
    });

    if (!items) setLocalItems((prev) => [...prev, ...nextItems]);
    if (validFiles.length) onChange?.(validFiles);
  };

  const handleDragEnter = (event: React.DragEvent) => {
    preventDefaults(event);
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    preventDefaults(event);
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    preventDefaults(event);
    setIsDragging(false);
    processFiles(event.dataTransfer.files);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(event.target.files);
    event.target.value = "";
  };

  return (
    <div className={cn("", className)}>
      {label && <h3 className="h4 mb-1">{label}</h3>}
      {description && <p className="body-sm mb-4">{description}</p>}

      <FileDropZone
        inputId={resolvedInputId}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        isDragging={isDragging}
        hasFiles={renderedItems.length > 0}
        supportedFormats={supportedFormats}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={preventDefaults}
        onDrop={handleDrop}
        onFileChange={handleFileChange}
      />

      <FileUploadList
        items={renderedItems}
        showProgress={showProgress}
        onRemove={removeItem}
      />
    </div>
  );
};

export type { FileUploadItem, FileUploadProps, FileUploadStatus } from "./types";
export default FileUpload;
