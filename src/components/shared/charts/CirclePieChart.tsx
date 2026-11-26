import type { CSSProperties } from "react";

export interface ChartSegment {
  id: string;
  value: number;
  percentage?: string;
  color: string;
  label?: string;
  [key: string]: string | number | undefined;
}

export interface CirclePieChartProps {
  data: ChartSegment[];
  /** Describes the population before its category counts for assistive technology. */
  populationLabel?: string;
  size?: number;
  innerRadius?: number | string;
  outerRadius?: number | string;
  className?: string;
  showLabels?: boolean;
}

function radiusRatio(value: number | string, fallback: number) {
  if (typeof value === "number") return value > 1 ? value / 100 : value;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed / 100 : fallback;
}

/**
 * Fill-first donut chart used across manager analytics and coaching surfaces.
 * A CSS conic fill is more reliable than a responsive SVG chart inside cards,
 * drawers, screenshots, and initially hidden tabs.
 */
export function CirclePieChart({
  data,
  populationLabel,
  size,
  innerRadius = "35%",
  outerRadius = "80%",
  className = "",
  showLabels = false,
}: CirclePieChartProps) {
  const validSegments = data.filter(
    (segment) => Number.isFinite(segment.value) && segment.value > 0,
  );
  const total = validSegments.reduce((sum, segment) => sum + segment.value, 0);
  const outerRatio = Math.max(0.1, Math.min(1, radiusRatio(outerRadius, 0.8)));
  const innerRatio = Math.max(
    0,
    Math.min(0.95, radiusRatio(innerRadius, 0.35) / outerRatio),
  );

  let consumed = 0;
  const stops = validSegments.map((segment) => {
    const start = (consumed / total) * 360;
    consumed += segment.value;
    const end = (consumed / total) * 360;
    return `${segment.color} ${start}deg ${end}deg`;
  });
  const fill = stops.length
    ? `conic-gradient(from -90deg, ${stops.join(", ")})`
    : "conic-gradient(#e5e7eb 0deg 360deg)";
  const mask = `radial-gradient(circle, transparent 0 ${innerRatio * 100}%, #000 ${innerRatio * 100 + 1}%)`;
  const chartStyle: CSSProperties = {
    width: `${outerRatio * 100}%`,
    height: `${outerRatio * 100}%`,
    background: fill,
    mask,
    WebkitMask: mask,
  };
  const countsLabel = validSegments.length
    ? validSegments.map((segment) => `${segment.label ?? segment.id}: ${segment.value}`).join(", ")
    : "No chart data";

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center ${className}`}
      style={size ? { width: size, height: size } : undefined}
      role="img"
      aria-label={populationLabel ? `${populationLabel}. ${countsLabel}` : countsLabel}
    >
      <div className="aspect-square rounded-full" style={chartStyle} aria-hidden="true" />
      {showLabels ? (
        <span className="absolute text-center text-sm font-semibold text-current">
          {total}
        </span>
      ) : null}
    </div>
  );
}

export default CirclePieChart;
