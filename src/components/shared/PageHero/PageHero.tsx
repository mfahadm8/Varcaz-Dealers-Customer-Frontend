import React from "react";
import { RotateCcw, Activity, ArrowLeft } from "lucide-react";
import { useRegisterPageChrome, type PageChromeAction, type PageChromeBackTarget } from "@/contexts";
import "../shared.scss";

export interface PageHeroProps {
  title: string;
  description: React.ReactNode;
  /** Optional control that identifies where this detail page returns to. */
  titleLeading?: React.ReactNode;
  /** Optional section label shown above the page title */
  eyebrow?: string;
  /** Optional status info like "Last Updated: 2 min ago" */
  statusInfo?: string;
  /** Show live indicator instead of refresh icon */
  showLiveIndicator?: boolean;
  /** Actions like buttons to display on the right side */
  actions?: React.ReactNode;
  /** Additional content like stats or buttons (alias for actions) */
  children?: React.ReactNode;
  className?: string;
  layoutClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  compactScope?: string;
  back?: PageChromeBackTarget;
  compactAction?: PageChromeAction;
  showBackInHero?: boolean;
}

export const PageHero: React.FC<PageHeroProps> = ({
  title,
  description,
  titleLeading,
  eyebrow,
  statusInfo,
  showLiveIndicator = false,
  actions,
  children,
  className = "",
  layoutClassName = "",
  titleClassName = "",
  descriptionClassName = "",
  compactScope,
  back,
  compactAction,
  showBackInHero = false,
}) => {
  useRegisterPageChrome({
    title,
    description: typeof description === "string" ? description : undefined,
    scopeSummary: compactScope,
    back,
    compactAction,
  });

  return (
    <div
      data-testid="page-hero-expanded"
      className={`bg-neutral-900 hero-wrapper ${className}`}
    >
      <div
        className={`app-layout relative flex h-full flex-col justify-center gap-6 py-8 lg:flex-row lg:items-center lg:justify-between ${layoutClassName}`}
      >
        <div className="min-w-0">
          {showBackInHero && back ? (
            <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-2">
              <button
                type="button"
                onClick={back.onSelect}
                className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-400"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to {back.label}
              </button>
              {eyebrow && (
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                  {eyebrow}
                </p>
              )}
            </div>
          ) : eyebrow ? (
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              {eyebrow}
            </p>
          ) : null}
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            {titleLeading && (
              <div data-testid="page-hero-title-leading" className="shrink-0">
                {titleLeading}
              </div>
            )}
            <h1
              data-testid="page-hero-title"
              className={`h2 min-w-0 text-white ${titleClassName}`}
            >
              {title}
            </h1>
          </div>
          <div
            className={`mt-1 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-0 font-regular text-white opacity-70 ${descriptionClassName}`}
          >
            {description}
            {statusInfo && (
              <span className="flex gap-1 sm:ml-3 text-secondary-500 items-center">
                {showLiveIndicator ? (
                  <>
                    <Activity className="w-5 h-5 animate-pulse" />
                    <span className="text-sm">{statusInfo}</span>
                  </>
                ) : (
                  <>
                    <RotateCcw size={20} className="shrink-0" />
                    {statusInfo}
                  </>
                )}
              </span>
            )}
          </div>
        </div>
        {(actions || children) && (
          <div className="flex items-center gap-4">{actions || children}</div>
        )}
      </div>
    </div>
  );
};

export default PageHero;
