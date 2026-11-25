import { Upload } from "lucide-react";
import type React from "react";
import { cn } from "@/utils/cn";

interface FileDropZoneProps {
  inputId: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  isDragging: boolean;
  hasFiles: boolean;
  supportedFormats: string;
  onDragEnter: (event: React.DragEvent) => void;
  onDragLeave: (event: React.DragEvent) => void;
  onDragOver: (event: React.DragEvent) => void;
  onDrop: (event: React.DragEvent) => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FileDropZone({
  inputId,
  accept,
  multiple,
  disabled,
  isDragging,
  hasFiles,
  supportedFormats,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileChange,
}: FileDropZoneProps) {
  return (
    <div
      className={cn(
        "border border-dashed rounded-lg p-6",
        disabled
          ? "border-neutral-150 bg-neutral-50 opacity-70"
          : isDragging
            ? "border-secondary-500 bg-neutral-100"
            : "border-neutral-150 hover:border-neutral-300",
        hasFiles ? "pb-2" : "",
      )}
      onDragEnter={disabled ? undefined : onDragEnter}
      onDragOver={disabled ? undefined : onDragOver}
      onDragLeave={disabled ? undefined : onDragLeave}
      onDrop={disabled ? undefined : onDrop}
    >
      <div className="text-center">
        <input
          id={inputId}
          type="file"
          className="hidden"
          onChange={onFileChange}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
        />
        <label
          htmlFor={inputId}
          className={cn("block", disabled ? "cursor-not-allowed" : "cursor-pointer")}
        >
          <div className="flex flex-col items-center justify-center">
            <Upload className="w-12 h-12 text-neutral-600 opacity-80 mb-4" />
            <p className="text-neutral-800 opacity-80 !font-normal mb-1">
              Drag and drop files here or click to browse
            </p>
            <p className="body-sm !text-neutral-400 mb-1">{supportedFormats}</p>
          </div>
        </label>
      </div>
    </div>
  );
}
