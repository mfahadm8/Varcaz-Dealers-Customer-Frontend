import { createContext, type ReactNode } from "react";

export interface PageChromeBackTarget {
  label: string;
  path?: string;
  onSelect?: () => void;
}

export interface PageChromeAction {
  label: string;
  path?: string;
  onSelect?: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  ariaLabel?: string;
}

/**
 * Pages own filter state. The shared navigation shell only hosts those
 * controls after a hero collapses, so it never invents another filter model.
 */
export interface PageChromeFilters {
  title: string;
  summary: string;
  renderContent: () => ReactNode;
}

export interface PageChromeRegistration {
  title: string;
  description?: string;
  scopeSummary?: string;
  /**
   * A contextual object page can explicitly retain its identity disclosure
   * after the expanded hero collapses. Workspace roots stay compact.
   */
  compactContextDisclosure?: boolean;
  back?: PageChromeBackTarget;
  compactAction?: PageChromeAction;
}

export interface PageChromeContextValue {
  page: PageChromeRegistration | null;
  filters: PageChromeFilters | null;
  isCollapsed: boolean;
  isFilterOpen: boolean;
  registerPage: (page: PageChromeRegistration) => void;
  clearPage: (title: string) => void;
  registerFilters: (filters: PageChromeFilters) => void;
  clearFilters: () => void;
  setCollapsed: (collapsed: boolean) => void;
  setFilterOpen: (open: boolean) => void;
  setScopeSummary: (summary?: string) => void;
}

export const PageChromeContext = createContext<PageChromeContextValue | null>(
  null,
);