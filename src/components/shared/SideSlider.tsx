import { useOverlayVisibility } from "./overlayVisibility";
import React, { type ReactNode, useRef, useEffect, useLayoutEffect, useId } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";

export type SideSliderVariant = "context" | "action" | "navigation";

export interface SideSliderBackAction {
  label: string;
  onClick: () => void;
}

interface SideSliderProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  width?: "sm" | "md" | "lg" | "xl" | "full";
  position?: "left" | "right";
  icon?: React.ReactNode;
  variant?: SideSliderVariant;
  eyebrow?: string;
  backAction?: SideSliderBackAction;
  footer?: ReactNode;
  contentClassName?: string;
  panelTestId?: string;
  flatHeader?: boolean;
}

export const SideSlider: React.FC<SideSliderProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width,
  position = "right",
  icon,
  variant,
  eyebrow,
  backAction,
  footer,
  contentClassName = "p-6",
  panelTestId,
  flatHeader = false,
}) => {
  const overlayVisible = useOverlayVisibility();
  const active = isOpen && overlayVisible;
  const sliderRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const subtitleId = useId();
  const onCloseRef = useRef(onClose);
  useLayoutEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  // Keep keyboard focus inside the active panel and return it to the opener.
  useEffect(() => {
    if (!active) return;

    triggerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab" || !sliderRef.current) return;

      const focusableElements = Array.from(
        sliderRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter(
        (element) =>
          element.getAttribute("aria-hidden") !== "true" &&
          element.offsetParent !== null,
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        sliderRef.current.focus();
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
      triggerRef.current = null;
    };
  }, [active]);

  // Prevent scroll behind slider
  useEffect(() => {
    if (!active) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [active]);

  const widthClasses = {
    sm: "max-w-sm w-full",
    md: "max-w-md w-full",
    lg: "max-w-2xl w-full",
    xl: "max-w-4xl w-full",
    full: "w-full",
  };

  const variantWidthClasses: Record<SideSliderVariant, string> = {
    context: "max-w-[560px] w-full",
    action: "max-w-[680px] w-full",
    navigation: "max-w-md w-full",
  };

  const resolvedWidthClass = width
    ? widthClasses[width]
    : variant
      ? variantWidthClasses[variant]
      : widthClasses.lg;

  const slideVariants = {
    hidden: {
      x: position === "right" ? "100%" : "-100%",
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      x: position === "right" ? "100%" : "-100%",
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div hidden={!overlayVisible} inert={!overlayVisible} style={{ display: overlayVisible ? undefined : "none" }} className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Slider Panel */}
          <motion.div
            ref={sliderRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={subtitle ? subtitleId : undefined}
            data-panel-variant={variant}
            data-testid={panelTestId}
            tabIndex={-1}
            className={`absolute ${
              position === "right" ? "right-0" : "left-0"
            } top-0 h-full ${resolvedWidthClass} bg-neutral-50 shadow-2xl flex flex-col`}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header - Dark gradient design */}
            <div
              className={`px-6 py-4 ${
                flatHeader
                  ? "bg-neutral-900"
                  : "bg-gradient-to-r from-neutral-900 to-neutral-800"
              }`}
            >
              <div className="flex min-w-0 items-start justify-between gap-4">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  {backAction && (
                    <button
                      type="button"
                      aria-label={backAction.label}
                      onClick={backAction.onClick}
                      className="mt-0.5 rounded-sm bg-white/10 p-2 transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <ArrowLeft className="h-4 w-4 text-white" />
                    </button>
                  )}
                  {icon && (
                    <div className="rounded-sm bg-white p-2">{icon}</div>
                  )}
                  <div className="min-w-0 flex-1">
                    {eyebrow && (
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-lime-200">
                        {eyebrow}
                      </p>
                    )}
                    <h2 id={titleId} className="break-words text-lg font-semibold text-white">
                      {title}
                    </h2>
                    {subtitle && (
                      <p id={subtitleId} className="mt-1 break-words text-xs leading-5 text-white/65">
                        {subtitle}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  aria-label={`Close ${title}`}
                  onClick={onClose}
                  className="shrink-0 rounded-sm bg-white/10 p-2 transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className={`flex-1 overflow-y-auto ${contentClassName}`}>
              {children}
            </div>

            {footer && (
              <div className="shrink-0 border-t border-neutral-200 bg-white px-6 py-4">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default SideSlider;
