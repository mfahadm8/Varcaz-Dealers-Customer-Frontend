import { useContext, useEffect, useRef } from "react";
import { PageChromeContext, type PageChromeRegistration } from "./context";

export function useOptionalPageChrome() {
  return useContext(PageChromeContext);
}

export function usePageChrome() {
  const context = useOptionalPageChrome();
  if (!context) {
    throw new Error("usePageChrome must be used within PageChromeProvider");
  }
  return context;
}

export function useRegisterPageChrome(
  registration: PageChromeRegistration | null,
) {
  const context = useOptionalPageChrome();
  const registerPage = context?.registerPage;
  const clearPage = context?.clearPage;
  const title = registration?.title;
  const description = registration?.description;
  const scopeSummary = registration?.scopeSummary;
  const backLabel = registration?.back?.label;
  const backPath = registration?.back?.path;
  const backOnSelect = registration?.back?.onSelect;
  const compactActionLabel = registration?.compactAction?.label;
  const compactActionPath = registration?.compactAction?.path;
  const compactActionOnSelect = registration?.compactAction?.onSelect;
  const compactActionDisabled = registration?.compactAction?.disabled;
  const compactActionAriaLabel = registration?.compactAction?.ariaLabel;
  const compactActionIcon = useRef(registration?.compactAction?.icon);
  compactActionIcon.current = registration?.compactAction?.icon;

  useEffect(() => {
    if (!title || !registerPage || !clearPage) return;
    registerPage({
      title,
      description,
      scopeSummary,
      back:
        backLabel || backPath || backOnSelect
          ? {
              label: backLabel ?? "Back",
              path: backPath,
              onSelect: backOnSelect,
            }
          : undefined,
      compactAction: compactActionLabel
        ? {
            label: compactActionLabel,
            path: compactActionPath,
            onSelect: compactActionOnSelect,
            disabled: compactActionDisabled,
            ariaLabel: compactActionAriaLabel,
            icon: compactActionIcon.current,
          }
        : undefined,
    });

  }, [
    backLabel,
    backOnSelect,
    backPath,
    clearPage,
    compactActionAriaLabel,
    compactActionDisabled,
    compactActionLabel,
    compactActionOnSelect,
    compactActionPath,
    description,
    registerPage,
    scopeSummary,
    title,
  ]);

  useEffect(() => {
    if (!title || !clearPage) return;
    return () => clearPage(title);
  }, [clearPage, title]);
}
