import React, { type ReactNode } from "react";
import { TrendingUp } from "lucide-react";
import { cn } from "@/utils/cn";

export interface MetricCardProps {
  value: string;
  label: string;
  trend: string;
  trendColor: string;
  valueColor: string;
  trendIconColor?: string;
  onClick?: () => void;
  metricName?: string;
  icon?: ReactNode;
  tone?: "neutral" | "positive" | "critical" | "attention" | "dark";
  compact?: boolean;
  className?: string;
}

/**
 * MetricCard - Reusable metric card component
 *
 * @param value - The main metric value to display
 * @param label - Label text describing the metric
 * @param trend - Trend text (e.g., "+5% vs last week")
 * @param valueColor - Tailwind color class for the value
 * @param trendColor - Tailwind color class for the trend percentage
 *
 * @example
 * ```tsx
 * <MetricCard
 *   value="85"
 *   label="Active Sessions"
 *   trend="+5% vs last week"
 *   valueColor="text-secondary-500"
 *   trendColor="text-secondary-500"
 * />
 * ```
 */
export const MetricCard: React.FC<MetricCardProps> = ({
  value,
  label,
  trend,
  valueColor,
  trendColor,
  onClick,
  metricName,
  icon,
  trendIconColor,
  tone = "neutral",
  compact = false,
  className,
}) => {
  // Parse trend text to separate percentage from description
  const trendMatch = trend.match(/([+-]\d+%)(.*)/) || trend.match(/(\d+%)(.*)/);
  const trendValue = trendMatch ? trendMatch[1] : "";
  const trendText = trendMatch ? trendMatch[2].trim() : trend;

  const toneClass = {
    neutral: "bg-[#F1F1EF] text-neutral-950",
    positive: "bg-[#EDF8E5] text-neutral-950",
    critical: "bg-[#FDE8EE] text-neutral-950",
    attention: "bg-[#FFF7DF] text-neutral-950",
    dark: "bg-neutral-900 text-white",
  }[tone];
  const isDark = tone === "dark";

  return (
    <div
      className={cn(
        "flex flex-col items-start justify-between overflow-hidden rounded-3xl p-6",
        compact ? "min-h-[190px]" : "h-[270px]",
        toneClass,
        onClick &&
          "cursor-pointer transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200",
        className,
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      aria-label={
        onClick ? `View details for ${metricName || label}` : undefined
      }
    >
      {icon ? (
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-2xl",
            isDark ? "bg-white/10 text-white" : "bg-white/80 text-neutral-800",
          )}
        >
          {icon}
        </div>
      ) : (
        <div />
      )}

      <div className="flex flex-col gap-0">
        {/* Value */}
        <div
          className={cn(
            compact ? "text-4xl" : "text-5xl",
            "font-[500]",
            isDark ? "text-white" : valueColor,
          )}
        >
          {value}
        </div>

        {/* Label and Trend */}
        <div className="flex flex-col gap-0.5 items-start">
          <div
            className={cn(
              "body-m py-2 text-left !text-base !font-normal",
              isDark ? "!text-white" : "!text-neutral-800",
            )}
          >
            {label}
          </div>
          {trend.trim() && <div className="flex items-end gap-1">
            <TrendingUp
              className={cn(
                "h-5 w-5",
                isDark
                  ? "text-secondary-300"
                  : trendIconColor ?? "text-secondary-500",
              )}
            />
            <div className="text-sm">
              <span
                className={cn(
                  "!font-bold",
                  isDark ? "text-secondary-300" : trendColor,
                )}
              >
                {trendValue}
              </span>
              <span className={isDark ? "text-white/65" : "text-neutral-900"}>
                {" "}{trendText}
              </span>
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
