/**
 * RadarChart - Reusable spider/radar chart component
 *
 * Displays data points in a circular radar chart visualization
 * Supports any number of dimensions/data points
 * Fully customizable colors and sizing
 */

import { cn } from "@/utils/cn";

export interface RadarChartDataPoint {
  name: string;
  score: number; // 0-100
  status?: "strong" | "good" | "weak";
}

interface RadarChartProps {
  data: RadarChartDataPoint[];
  width?: number;
  height?: number;
  fillColor?: string;
  strokeColor?: string;
  fillOpacity?: number;
  strokeWidth?: number;
  className?: string;
  showLabels?: boolean;
  pointRadius?: number;
}

const defaultStatusColors = {
  strong: "#82c441", // secondary-500
  good: "#f9b70e",   // status-yellow
  weak: "#dc425f",   // primary-500
};

export function RadarChart({
  data,
  width = 260,
  height = 260,
  fillColor = "rgba(220, 66, 95, 0.15)",
  strokeColor = "#dc425f",
  fillOpacity = 0.15,
  strokeWidth = 2,
  className,
  showLabels = true,
  pointRadius = 5,
}: RadarChartProps) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 50; // 50px padding for labels

  // Calculate points for each data dimension
  const points = data.map((item, idx) => {
    const angle = (idx / data.length) * 2 * Math.PI - Math.PI / 2;
    const r = (item.score / 100) * radius;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
      labelX: centerX + (radius + 25) * Math.cos(angle),
      labelY: centerY + (radius + 25) * Math.sin(angle),
      ...item,
    };
  });

  // Create path data for the filled polygon
  const pathData =
    points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <div className={cn("flex justify-center", className)}>
      <svg width={width} height={height} className="overflow-visible">
        {/* Background circles (scale grid) */}
        {[25, 50, 75, 100].map((pct) => (
          <circle
            key={pct}
            cx={centerX}
            cy={centerY}
            r={(pct / 100) * radius}
            fill="none"
            stroke="rgba(106, 105, 105, 0.1)"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines from center to each dimension */}
        {points.map((p, idx) => (
          <line
            key={idx}
            x1={centerX}
            y1={centerY}
            x2={
              centerX +
              radius * Math.cos((idx / points.length) * 2 * Math.PI - Math.PI / 2)
            }
            y2={
              centerY +
              radius * Math.sin((idx / points.length) * 2 * Math.PI - Math.PI / 2)
            }
            stroke="rgba(106, 105, 105, 0.1)"
            strokeWidth="1"
          />
        ))}

        {/* Data polygon */}
        <path
          d={pathData}
          fill={fillColor}
          fillOpacity={fillOpacity}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />

        {/* Data points */}
        {points.map((p, idx) => {
          const pointColor = p.status
            ? defaultStatusColors[p.status]
            : strokeColor;

          return (
            <g key={idx}>
              <circle
                cx={p.x}
                cy={p.y}
                r={pointRadius}
                fill={pointColor}
              />
              {showLabels && (
                <text
                  x={p.labelX}
                  y={p.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs fill-neutral-700"
                >
                  {p.name} ({p.score}%)
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
