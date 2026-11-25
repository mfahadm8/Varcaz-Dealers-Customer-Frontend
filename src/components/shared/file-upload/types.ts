export type FileUploadStatus =
  | "queued"
  | "uploading"
  | "processing"
  | "success"
  | "error";

export interface FileUploadItem {
  id: string;
  name: string;
  size: number;
  type?: string;
  status?: FileUploadStatus;
  progress?: number;
  error?: string;
  removable?: boolean;
  file?: File;
}

export interface FileUploadProps {
  label?: string;
  description?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onChange?: (files: File[]) => void;
  onError?: (error: string) => void;
  onRemoveItem?: (item: FileUploadItem) => void;
  className?: string;
  showProgress?: boolean;
  supportedFormats?: string;
  items?: FileUploadItem[];
  disabled?: boolean;
  inputId?: string;
}
