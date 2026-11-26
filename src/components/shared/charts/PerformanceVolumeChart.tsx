import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PerformanceVolumeDataPoint {
  name: string;
  performance: number;
  volume: number;
}

interface PerformanceVolumeChartProps {
  data: PerformanceVolumeDataPoint[];
  height?: number;
  showLegend?: boolean;
  volumeOnly?: boolean;
}

interface ChartPayloadEntry {
  color?: string;
  dataKey?: string;
  value?: string | number;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: ChartPayloadEntry[];
  label?: string | number;
}

interface XAxisTickProps {
  x?: number | string;
  y?: number | string;
  payload?: {
    value?: string | number;
  };
}

const CustomTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-neutral-200 rounded-lg px-4 py-3 shadow-xl">
        <p className="text-sm font-medium mb-2 text-neutral-600">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 mt-1">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs capitalize text-neutral-500">
              {entry.dataKey === "performance" ? "Avg Score" : "Volume"}:
            </span>
            <span className="text-sm font-bold text-neutral-900">
              {entry.value}{entry.dataKey === "performance" ? "%" : ""}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

interface ChartLegendProps {
  payload?: ChartPayloadEntry[];
}

const CustomLegend = ({ payload = [] }: ChartLegendProps) => {
  return (
    <div className="flex items-center justify-end gap-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <div
            className={`w-2 h-2 ${
              entry.value === "volume" ? "rounded-sm" : "rounded-full"
            }`}
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[10px] font-bold uppercase text-neutral-400">
            {entry.value === "performance" ? "Avg Score" : "Volume"}
          </span>
        </div>
      ))}
    </div>
  );
};

export const PerformanceVolumeChart: React.FC<PerformanceVolumeChartProps> = ({
  data,
  height = 500,
  showLegend = true,
  volumeOnly = false,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart
        data={data}
        margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(0, 0, 0, 0.06)"
          vertical={false}
        />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={({ x, y, payload }: XAxisTickProps) => {
            const label = String(payload?.value ?? "");
            const xPosition = typeof x === "number" ? x : Number(x ?? 0);
            const yPosition = typeof y === "number" ? y : Number(y ?? 0);
            const isToday = label === "Today";
            return (
              <text
                x={xPosition}
                y={yPosition + 12}
                textAnchor="middle"
                fill={isToday ? "#111827" : "#9ca3af"}
                fontSize={12}
                fontWeight={isToday ? 700 : 500}
              >
                {label}
              </text>
            );
          }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#9ca3af", fontSize: 10 }}
          domain={volumeOnly ? [0, "auto"] : [0, 100]}
          allowDecimals={!volumeOnly}
          tickFormatter={(value) => volumeOnly ? String(value) : `${value}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        {showLegend && (
          <Legend content={<CustomLegend />} verticalAlign="top" />
        )}
        <Bar
          dataKey="volume"
          fill="#dc425f"
          radius={[4, 4, 0, 0]}
          barSize={32}
          fillOpacity={0.8}
        />
        {!volumeOnly && <Line
          type="monotone"
          dataKey="performance"
          stroke="#dc425f"
          strokeWidth={3}
          dot={{
            r: 5,
            fill: "#dc425f",
            stroke: "white",
            strokeWidth: 2,
          }}
          activeDot={{
            r: 7,
            fill: "#dc425f",
            stroke: "white",
            strokeWidth: 2,
          }}
        />}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default PerformanceVolumeChart;
