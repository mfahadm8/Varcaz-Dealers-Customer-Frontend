import React, { useLayoutEffect, useRef, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export interface LineData {
  name: string;
  [key: string]: string | number;
}

export interface LineConfig {
  dataKey: string;
  stroke: string;
  name?: string;
  strokeWidth?: number;
  dot?: boolean | { fill: string; r: number };
  activeDot?: boolean | { r: number };
  fill?: string;
  fillOpacity?: number;
}

interface LineChartProps {
  data: LineData[];
  lines: LineConfig[];
  className?: string;
  showGrid?: boolean;
  showAxisLines?: boolean;
  curveType?: "monotone" | "linear" | "natural" | "step";
  xAxisKey?: string;
  yAxisFormatter?: (value: number) => string;
  yAxisDomain?: [number, number];
  height?: string | number;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  variant?: "line" | "area"; // <-- keep but ignore
  gradientOpacity?: { start: number; end: number };
  onDataPointClick?: (point: Record<string, string | number>) => void;
  tooltipValueFormatter?: (value: string | number, name?: string) => string;
}

/* ---------------------------- CUSTOM TOOLTIP ---------------------------- */
interface LineTooltipItem {
  color?: string;
  name?: string | number;
  value?: string | number | readonly (string | number)[];
}

interface LineTooltipProps {
  active?: boolean;
  payload?: readonly LineTooltipItem[];
  label?: string | number;
  valueFormatter?: (value: string | number, name?: string) => string;
}

interface InteractiveDotProps {
  cx?: number;
  cy?: number;
  index?: number;
  payload?: Record<string, string | number>;
}

const CustomTooltip = ({ active, payload, label, valueFormatter }: LineTooltipProps) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E9EAEB",
        borderRadius: 8,
        padding: 10,
        fontSize: 12,
      }}
    >
      <div style={{ marginBottom: 4, fontWeight: 500 }}>{label}</div>

      {payload.map((item, i) => (
        <div key={i} style={{ color: item.color }}>
          {item.name}: {valueFormatter ? valueFormatter(
            typeof item.value === "string" || typeof item.value === "number"
              ? item.value
              : item.value?.join(", ") ?? 0,
            item.name == null ? undefined : String(item.name),
          ) : `${item.value}%`}
        </div>
      ))}
    </div>
  );
};

/* ------------------------------- CHART ---------------------------------- */
export const LineChart: React.FC<LineChartProps> = ({
  data,
  lines,
  className = "",
  showGrid = false,
  showAxisLines = false,
  curveType = "linear",
  xAxisKey = "name",
  yAxisFormatter,
  yAxisDomain,
  height,
  margin = { top: 5, right: 20, left: 0, bottom: 5 },
  gradientOpacity = { start: 0.4, end: 0 },
  onDataPointClick,
  tooltipValueFormatter,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const updateSize = () => {
      const rect = node.getBoundingClientRect();
      setSize({
        width: Math.max(1, Math.floor(rect.width)),
        height: Math.max(1, Math.floor(rect.height)),
      });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const chartHeight =
    typeof height === "number" ? height : size.height;
  const canRenderChart = size.width > 1 && chartHeight > 1;

  return (
    <div
      ref={containerRef}
      className={`w-full h-full min-h-[120px] min-w-0 ${className}`}
    >
      {canRenderChart && (
        <AreaChart
          width={size.width}
          height={chartHeight}
          data={data}
          margin={margin}
          onClick={(state) => {
            if (!onDataPointClick) return;
            const selected = (state as unknown as {
              activePayload?: Array<{ payload?: Record<string, string | number> }>;
            })?.activePayload?.[0]?.payload;
            if (selected) onDataPointClick(selected);
          }}
          style={{ cursor: onDataPointClick ? "pointer" : undefined }}
        >
          <defs>
            {lines.map((line) => (
              <linearGradient
                key={`gradient-${line.dataKey}`}
                id={`gradient-${line.dataKey}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={line.stroke}
                  stopOpacity={gradientOpacity.start}
                />
                <stop
                  offset="95%"
                  stopColor={line.stroke}
                  stopOpacity={gradientOpacity.end}
                />
              </linearGradient>
            ))}
          </defs>

          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E9EAEB" />}

          <XAxis
            dataKey={xAxisKey}
            tick={{ fill: "#535862", fontSize: 12 }}
            axisLine={showAxisLines ? { stroke: "#E9EAEB" } : false}
            tickLine={false}
            dy={13}
          />

          <YAxis
            tick={{ fill: "#535862", fontSize: 12 }}
            axisLine={showAxisLines ? { stroke: "#E9EAEB" } : false}
            tickLine={false}
            tickFormatter={yAxisFormatter}
            domain={yAxisDomain}
            dy={-2}
          />

          <Tooltip content={(props) => <CustomTooltip {...props} valueFormatter={tooltipValueFormatter} />} />

          {/* ----------- RENDER ONLY AREA LAYERS ----------- */}
          {lines.map((line) => (
            <Area
              key={line.dataKey}
              type={curveType}
              dataKey={line.dataKey}
              stroke={line.stroke}
              strokeWidth={line.strokeWidth || 2}
              fill={`url(#gradient-${line.dataKey})`}
              dot={onDataPointClick ? (props: InteractiveDotProps) => (
                <circle
                  key={"area-dot-" + line.dataKey + "-" + (props.index ?? String(props.payload?.[xAxisKey] ?? "point"))}
                  cx={props.cx}
                  cy={props.cy}
                  r={5}
                  fill={line.stroke}
                  stroke="#ffffff"
                  strokeWidth={2}
                  role="button"
                  tabIndex={0}
                  aria-label={`${String(props.payload?.[xAxisKey] ?? "Period")}: ${String(props.payload?.[line.dataKey] ?? 0)} ${line.name ?? line.dataKey}`}
                  className="recharts-dot recharts-area-dot cursor-pointer outline-none focus:stroke-[4]"
                  onClick={(event) => {
                    event.stopPropagation();
                    if (props.payload) onDataPointClick(props.payload);
                  }}
                  onKeyDown={(event) => {
                    if ((event.key === "Enter" || event.key === " ") && props.payload) {
                      event.preventDefault();
                      onDataPointClick(props.payload);
                    }
                  }}
                />
              ) : false}
              activeDot={onDataPointClick ? { r: 8, pointerEvents: "none" } : false}
              name={line.name}
              cursor={onDataPointClick ? "pointer" : undefined}
              onClick={(entry) => onDataPointClick?.(((entry as { payload?: Record<string, string | number> }).payload ?? entry) as Record<string, string | number>)}
            />
          ))}
        </AreaChart>
      )}
    </div>
  );
};

export default LineChart;
