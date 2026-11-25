import { useOverlayVisibility } from "./overlayVisibility";
import React, { type ReactNode, useRef, useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClick?: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  description?: string;
  showFooter?: boolean; // NEW optional flag
  btnText?: string;
  cancelText?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClick,
  onClose,
  title,
  children,
  size = "md",
  initialFocusRef,
  description = "",
  showFooter = false, // default: show footer
  btnText,
  cancelText = "Cancel",
}) => {
  const overlayVisible = useOverlayVisibility();
  const active = isOpen && overlayVisible;
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!active) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = () => Array.from(modalRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
    ) ?? []).filter(element => element.offsetParent !== null);
    const frame = requestAnimationFrame(() => (initialFocusRef?.current ?? focusable()[0] ?? modalRef.current)?.focus());
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const elements = focusable();
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!first) { event.preventDefault(); modalRef.current?.focus(); }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', trapFocus);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', trapFocus);
      if (opener?.isConnected) opener.focus();
    };
  }, [active, initialFocusRef]);

  // Close on Escape
  useEffect(() => {
    if (!active) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && active) onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [active, onClose]);

  // Prevent scroll behind modal
  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [active]);

  const sizeClasses = {
    sm: "max-w-sm p-1",
    md: "max-w-md p-2",
    lg: "max-w-lg p-2",
    xl: "max-w-3xl p-3  ",
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          hidden={!overlayVisible}
          inert={!overlayVisible}
          style={{ display: overlayVisible ? undefined : "none" }}
          className="
            fixed inset-0 z-[10000] flex items-center justify-center
            bg-black/70
          "
          onClick={(e) => {
            if (
              modalRef.current &&
              !modalRef.current.contains(e.target as Node)
            ) {
              onClose();
            }
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={modalRef}
            role="dialog"
            tabIndex={-1}
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descriptionId : undefined}
            className={`w-full ${sizeClasses[size]} bg-white rounded-xl shadow-xl`}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: {
                type: "spring",
                stiffness: 220,
                damping: 22,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 10,
              transition: { duration: 0.15 },
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-3">
              <div>
                <h3 id={titleId} className="h4">{title}</h3>
                {description && <p id={descriptionId} className="body-sm text-neutral-600">{description}</p>}
              </div>

              <motion.button
                type="button"
                aria-label="Close"
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-neutral-500 hover:text-neutral-900 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            </div>

            {/* Body */}
            <div className="max-h-[75vh] overflow-y-auto px-5 pb-4">
              {children}
            </div>

            {/* Footer (Only if modal is open & footer allowed) */}
            {showFooter && (
              <div className="px-5 py- flex justify-end gap-3 mb-5">
                <Button variant="tertiary" onClick={onClose}>
                  {cancelText}
                </Button>

                <Button variant="primary" type="button" onClick={onClick}>
                  {btnText || "Save"}
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
