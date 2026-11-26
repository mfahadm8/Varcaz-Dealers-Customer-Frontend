import { AlertCircle, CheckCircle, File, Loader2, X } from "lucide-react";
import { cn } from "@/utils/cn";
import type { FileUploadItem, FileUploadStatus } from "./types";
import { formatFileSize, getFileExtension } from "./utils";

interface FileUploadListProps {
  items: FileUploadItem[];
  showProgress: boolean;
  onRemove?: (item: FileUploadItem) => void;
}

function getStatusIcon(status: FileUploadStatus | undefined) {
  switch (status) {
    case "uploading":
    case "processing":
      return <Loader2 className="w-5 h-5 animate-spin text-secondary-500" />;
    case "success":
      return <CheckCircle className="w-5 h-5 text-secondary-500" />;
    case "error":
      return <AlertCircle className="w-5 h-5 text-status-error" />;
    default:
      return null;
  }
}

function fileIconClass(fileName: string) {
  const extension = getFileExtension(fileName);
  if (["mp3", "wav", "ogg", "m4a", "flac"].includes(extension)) {
    return "text-secondary-500";
  }
  return "text-secondary-500";
}

function progressWidth(item: FileUploadItem) {
  if (item.status === "success") return 100;
  return Math.max(0, Math.min(100, item.progress ?? 0));
}

export function FileUploadList({ items, showProgress, onRemove }: FileUploadListProps) {
  if (!items.length) return null;

  return (
    <div className="mt-6 space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            "bg-white rounded-md border border-neutral-150 p-3",
            item.status === "error" && "border-status-error bg-status-error-10",
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center min-w-0">
              <File className={cn("w-5 h-5 shrink-0", fileIconClass(item.name))} />
              <div className="ml-2 min-w-0">
                <span className="body-sm text-neutral-800 font-medium truncate block">
                  {item.name}
                </span>
                <span className="body-xs text-neutral-400">{formatFileSize(item.size)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              {getStatusIcon(item.status)}
              {item.removable !== false && onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(item)}
                  className="text-neutral-400 hover:text-neutral-700"
                  aria-label={`Remove ${item.name}`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {showProgress && ["uploading", "processing", "success"].includes(item.status ?? "") && (
            <div className="w-full bg-neutral-100 rounded-full h-1.5 mt-3">
              <div
                className="bg-secondary-500 h-1.5 rounded-full transition-all"
                style={{ width: `${progressWidth(item)}%` }}
              />
            </div>
          )}

          {item.error && <p className="text-xs text-status-error mt-1">{item.error}</p>}
        </div>
      ))}
    </div>
  );
}
