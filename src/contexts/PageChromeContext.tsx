import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  PageChromeContext,
  type PageChromeFilters,
  type PageChromeRegistration,
} from "./page-chrome/context";

export type {
  PageChromeAction,
  PageChromeBackTarget,
  PageChromeFilters,
  PageChromeRegistration,
} from "./page-chrome/context";

function registrationsMatch(
  left: PageChromeRegistration | null,
  right: PageChromeRegistration,
) {
  return (
    left?.title === right.title &&
    left.description === right.description &&
    left.scopeSummary === right.scopeSummary &&
    left.compactContextDisclosure === right.compactContextDisclosure &&
    left.back?.label === right.back?.label &&
    left.back?.path === right.back?.path &&
    left.back?.onSelect === right.back?.onSelect &&
    left.compactAction?.label === right.compactAction?.label &&
    left.compactAction?.path === right.compactAction?.path &&
    left.compactAction?.onSelect === right.compactAction?.onSelect &&
    left.compactAction?.disabled === right.compactAction?.disabled &&
    left.compactAction?.ariaLabel === right.compactAction?.ariaLabel
  );
}

export function PageChromeProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<PageChromeRegistration | null>(null);
  const [filters, setFilters] = useState<PageChromeFilters | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFilterOpen, setFilterOpenState] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.pageChromeCollapsed = isCollapsed ? "true" : "false";

    return () => {
      delete document.documentElement.dataset.pageChromeCollapsed;
    };
  }, [isCollapsed]);

  const registerPage = useCallback((registration: PageChromeRegistration) => {
    setPage((current) =>
      registrationsMatch(current, registration) ? current : registration,
    );
  }, []);

  const clearPage = useCallback((title: string) => {
    setPage((current) => (current?.title === title ? null : current));
    setIsCollapsed(false);
    setFilterOpenState(false);
  }, []);

  const registerFilters = useCallback((registration: PageChromeFilters) => {
    setFilters((current) => {
      const isSameOwner =
        current?.title === registration.title &&
        current.renderContent === registration.renderContent;

      if (!isSameOwner) setFilterOpenState(false);
      return isSameOwner && current?.summary === registration.summary
        ? current
        : registration;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(null);
    setFilterOpenState(false);
  }, []);

  const setFilterOpen = useCallback(
    (open: boolean) => setFilterOpenState(open && Boolean(filters)),
    [filters],
  );

  const setCollapsed = useCallback((collapsed: boolean) => {
    setIsCollapsed((current) => (current === collapsed ? current : collapsed));
    if (!collapsed) setFilterOpenState(false);
  }, []);

  const setScopeSummary = useCallback((summary?: string) => {
    setPage((current) => {
      if (!current || current.scopeSummary === summary) return current;
      return { ...current, scopeSummary: summary };
    });
  }, []);

  const value = useMemo(
    () => ({
      page,
      filters,
      isCollapsed,
      isFilterOpen,
      registerPage,
      clearPage,
      registerFilters,
      clearFilters,
      setCollapsed,
      setFilterOpen,
      setScopeSummary,
    }),
    [
      clearFilters,
      clearPage,
      filters,
      isCollapsed,
      isFilterOpen,
      page,
      registerFilters,
      registerPage,
      setCollapsed,
      setFilterOpen,
      setScopeSummary,
    ],
  );

  return (
    <PageChromeContext.Provider value={value}>
      {children}
    </PageChromeContext.Provider>
  );
}