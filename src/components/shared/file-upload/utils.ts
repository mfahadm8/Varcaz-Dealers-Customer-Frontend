import type { FileUploadItem } from "./types";

export function createUploadItem(file: File): FileUploadItem {
  return {
    id: `${file.name}-${file.size}-${file.lastModified}`,
    name: file.name,
    size: file.size,
    type: file.type,
    status: "queued",
    progress: 0,
    removable: true,
    file,
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

export function validateFileSize(file: File, maxSizeMb: number): string | null {
  if (file.size <= maxSizeMb * 1024 * 1024) return null;
  return `File "${file.name}" exceeds the maximum size of ${maxSizeMb}MB`;
}

export function getFileExtension(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}
