import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

export interface WorkspaceTab<T extends string> {
  id: T;
  label: string;
  icon?: ReactNode;
  badge?: ReactNode;
  href?: string;
}

interface WorkspaceTabsProps<T extends string> {
  ariaLabel: string;
  tabs: WorkspaceTab<T>[];
  activeTab: T;
  onChange: (tab: T) => void;
  className?: string;
  variant?: "default" | "focus" | "quiet" | "sidebar";
  collapsed?: boolean;
}

export function WorkspaceTabs<T extends string>({
  ariaLabel,
  tabs,
  activeTab,
  onChange,
  className = "",
  variant = "default",
  collapsed = false,
}: WorkspaceTabsProps<T>) {
  const focus = variant === "focus";
  const quiet = variant === "quiet";
  const sidebar = variant === "sidebar";
  const [desktop, setDesktop] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches,
  );
  useEffect(() => {
    if (!sidebar) return;
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [sidebar]);
  const vertical = sidebar && desktop;
  const tablistRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const list = tablistRef.current;
    if (!list || vertical) return;
    const revealSelection = () => {
      const selected = list.querySelector<HTMLButtonElement>('[aria-selected="true"]');
      if (!selected) return;
      const viewport = list.getBoundingClientRect();
      const item = selected.getBoundingClientRect();
      // Move only this strip, preserving the page's reading position and focus.
      if (item.left < viewport.left) list.scrollLeft += item.left - viewport.left;
      else if (item.right > viewport.right) list.scrollLeft += item.right - viewport.right;
    };
    revealSelection();
    const observer = new ResizeObserver(revealSelection);
    observer.observe(list);
    return () => observer.disconnect();
  }, [activeTab, vertical]);

  return (
    <div
      ref={tablistRef}
      role="tablist"
      aria-label={ariaLabel}
      aria-orientation={vertical ? "vertical" : "horizontal"}
      onKeyDown={(event) => {
        const forward = vertical ? "ArrowDown" : "ArrowRight";
        const backward = vertical ? "ArrowUp" : "ArrowLeft";
        if (![forward, backward, "Home", "End"].includes(event.key)) return;
        const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]'));
        const current = buttons.findIndex(button => button === document.activeElement);
        if (current < 0 || !buttons.length) return;
        event.preventDefault();
        const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1
          : (current + (event.key === forward ? 1 : -1) + buttons.length) % buttons.length;
        buttons[next].focus();
        buttons[next].click();
      }}
      className={`flex max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
        focus
          ? "items-center gap-1 rounded-lg bg-neutral-100/70 p-1"
          : sidebar
            ? "flex-row gap-1 rounded-sm bg-neutral-50 p-1 lg:flex-col lg:overflow-visible"
            : quiet
              ? "gap-1 bg-neutral-50 px-3"
              : "gap-1 rounded-xl bg-neutral-100 p-1"
      } ${className}`}
    >
      {tabs.map((tab) => {
        const active = tab.id === activeTab;
        const Element = tab.href ? 'a' : 'button';
        return (
          <Element
            key={tab.id}
            {...(tab.href ? { href: tab.href } : { type: 'button' as const })}
            role="tab"
            aria-selected={active}
            title={sidebar && collapsed ? tab.label : undefined}
            data-testid={`workspace-tab-${tab.id}`}
            onClick={event => {
              if (tab.href && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)) return;
              if (tab.href) event.preventDefault();
              onChange(tab.id);
            }}
            onKeyDown={tab.href ? event => {
              if (event.key === ' ') { event.preventDefault(); onChange(tab.id); }
            } : undefined}
            className={`inline-flex min-h-10 shrink-0 items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${sidebar && collapsed ? "lg:gap-0" : ""} ${
              focus
                ? active
                  ? "rounded-md bg-neutral-900 !min-h-11 !py-2 text-white"
                  : "rounded-md text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950"
                : sidebar
                  ? active
                    ? `w-auto lg:w-full rounded-sm bg-neutral-900 text-white ${collapsed ? "justify-between lg:min-h-9 lg:justify-center lg:px-2" : "justify-between"}`
                    : `w-auto lg:w-full rounded-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 ${collapsed ? "justify-between lg:min-h-9 lg:justify-center lg:px-2" : "justify-between"}`
                  : quiet
                    ? active
                      ? "relative py-3 text-neutral-950 after:absolute after:inset-x-4 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary-500"
                      : "py-3 text-neutral-500 hover:text-neutral-950"
                    : active
                      ? "rounded-lg bg-white text-neutral-950 shadow-sm"
                      : "rounded-lg text-neutral-600 hover:bg-white/60 hover:text-neutral-950"
            }`}
          >
            <span
              className={`inline-flex items-center gap-2 whitespace-nowrap ${
                sidebar && collapsed ? "lg:gap-0" : ""
              }`}
            >
              {tab.icon && (
                <span
                  aria-hidden="true"
                  className={
                    quiet && active ? "text-primary-500" : "text-current"
                  }
                >
                  {tab.icon}
                </span>
              )}
              <span
                className={
                  sidebar
                    ? `overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ease-out ${
                        collapsed
                          ? "lg:max-w-0 lg:opacity-0"
                          : "max-w-[160px] opacity-100"
                      }`
                    : ""
                }
              >
                {tab.label}
              </span>
            </span>
            {tab.badge !== undefined && (
              <span
                className={`min-w-6 overflow-hidden rounded-full px-2 py-0.5 text-center text-xs font-medium transition-[max-width,opacity,padding] duration-300 ease-out ${sidebar && collapsed ? "lg:min-w-0 lg:max-w-0 lg:px-0 lg:opacity-0" : "max-w-16 opacity-100"} ${
                  active
                    ? focus
                      ? "bg-primary-50 text-primary-600"
                      : sidebar
                        ? "bg-primary-50 text-primary-600"
                        : quiet
                          ? "bg-primary-50 text-primary-600"
                          : "bg-neutral-900 text-white"
                    : focus
                      ? "bg-neutral-800 text-neutral-200"
                      : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {tab.badge}
              </span>
            )}
          </Element>
        );
      })}
    </div>
  );
}

export default WorkspaceTabs;
