/**
 * ConfirmModal - Reusable confirmation dialog
 */

import { Modal } from "./Modal";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "info" | "success" | "warning" | "error";
  isProcessing?: boolean;
}

const variantConfig = {
  info: {
    icon: Info,
    iconClass: "text-primary-500",
    bgClass: "bg-primary-500/10",
  },
  success: {
    icon: CheckCircle,
    iconClass: "!text-secondary-500",
    bgClass: "bg-neutral-50 !text-secondary-500",
  },
  warning: {
    icon: AlertCircle,
    iconClass: "text-status-yellow",
    bgClass: "bg-status-yellow/10",
  },
  error: {
    icon: AlertCircle,
    iconClass: "text-status-error",
    bgClass: "bg-status-error/10",
  },
};

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "info",
  isProcessing = false,
}: ConfirmModalProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onClick={onConfirm}
      title={title}
      showFooter={true}
      btnText={isProcessing ? "Processing..." : confirmText}
      cancelText={cancelText}
      size="md"
    >
      <div
        className={`flex items-start gap-3 p-4 ${config.bgClass} rounded-lg`}
      >
        <Icon className={`w-5 h-5 ${config.iconClass} flex-shrink-0 mt-0.5`} />
        <p className="body-sm !text-neutral-900">{message}</p>
      </div>
    </Modal>
  );
}
