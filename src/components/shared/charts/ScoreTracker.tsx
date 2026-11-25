import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

// Single bar data item (original)
interface SingleBarDataItem {
  name: string;
  score: number;
  date: string;
}

// Grouped bar data item (for timeline with multiple metrics)
export interface GroupedBarDataItem {
  date: string;
  scriptCompletion: number;
  successScore: number;
  talkRatio: number;
}

export type MetricType = "scriptCompletion" | "successScore" | "talkRatio";

const METRIC_COLORS: Record<MetricType, string> = {
  scriptCompletion: "#6e8dff",
  successScore: "#db73e4",
  talkRatio: "#ff748d",
};

interface ScoreTrackerProps {
  // For single bar mode
  data?: SingleBarDataItem[];
  // For grouped bar mode
  groupedData?: GroupedBarDataItem[];
  visibleMetrics?: MetricType[];
  height?: number;
  variant?: "single" | "grouped";
  onBarClick?: (data: GroupedBarDataItem, metric: MetricType) => void;
}

const defaultData = [
  { name: "Efiuh", score: 60, date: "Feb 10, 2023" },
  { name: "Alex", score: 640, date: "Mar 10, 2023" },
  { name: "Chris", score: 650, date: "Apr 10, 2023" },
];

const METRIC_LABELS: Record<MetricType, string> = {
  scriptCompletion: "Script Completion",
  successScore: "Success Score",
  talkRatio: "Talk Ratio",
};

interface ScoreTooltipEntry {
  dataKey?: string;
  value?: string | number;
}

interface ScoreTooltipProps {
  active?: boolean;
  payload?: ScoreTooltipEntry[];
  label?: string | number;
}

interface SingleTooltipProps {
  payload?: { name?: string };
}

const CustomTooltip = ({ active, payload, label }: ScoreTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-primary-500 border border-white/10 rounded-2xl px-4 py-3 shadow-xl min-w-[160px]">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-white/70 mb-1">{label}</span>
          {payload.map((entry) => (
            <div key={entry.dataKey} className="flex items-center gap-2">
              {/* <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: METRIC_COLORS[entry.dataKey as MetricType],
                }}
              /> */}
              <span className="text-sm text-white/80">
                {METRIC_LABELS[entry.dataKey as MetricType]}
              </span>
              <span className="text-sm font-semibold text-white ml-auto">
                {entry.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const ScoreTracker: React.FC<ScoreTrackerProps> = ({
  data,
  groupedData,
  visibleMetrics = ["scriptCompletion", "successScore", "talkRatio"],
  height = 300,
  variant = "single",
  onBarClick,
}) => {
  const chartData = data && data.length > 0 ? data : defaultData;

  // Grouped bar mode for timeline
  if (variant === "grouped" && groupedData) {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={groupedData}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          barGap={2}
          barCategoryGap="20%"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(0, 0, 0, 0.06)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#6a6969",
              fontSize: 14,
              fontWeight: 400,
            }}
            dy={10}
          />
          <YAxis
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#6a6969",
              fontSize: 14,
            }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(0, 0, 0, 0.02)" }}
          />
          {visibleMetrics.includes("scriptCompletion") && (
            <Bar
              dataKey="scriptCompletion"
              fill={METRIC_COLORS.scriptCompletion}
              radius={[24, 24, 0, 0]}
              barSize={12}
              cursor={onBarClick ? "pointer" : "default"}
              onClick={(data) =>
                onBarClick?.(
                  data as unknown as GroupedBarDataItem,
                  "scriptCompletion"
                )
              }
            />
          )}
          {visibleMetrics.includes("successScore") && (
            <Bar
              dataKey="successScore"
              fill={METRIC_COLORS.successScore}
              radius={[24, 24, 0, 0]}
              barSize={12}
              cursor={onBarClick ? "pointer" : "default"}
              onClick={(data) =>
                onBarClick?.(
                  data as unknown as GroupedBarDataItem,
                  "successScore"
                )
              }
            />
          )}
          {visibleMetrics.includes("talkRatio") && (
            <Bar
              dataKey="talkRatio"
              fill={METRIC_COLORS.talkRatio}
              radius={[24, 24, 0, 0]}
              barSize={12}
              cursor={onBarClick ? "pointer" : "default"}
              onClick={(data) =>
                onBarClick?.(data as unknown as GroupedBarDataItem, "talkRatio")
              }
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // Single bar mode (original behavior)
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData}>
        <CartesianGrid
          stroke="#e5e5e5"
          strokeDasharray="1 1"
          vertical={false}
        />
        <YAxis
          dataKey="score"
          tick={{ fill: "#afadab", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          padding={{ bottom: 2 }}
        />
        <XAxis
          dataKey="date"
          tick={{ fill: "#afadab", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          padding={{ left: 10, right: 10 }}
        />
        <Tooltip
          cursor={false}
          contentStyle={{
            backgroundColor: "#dc425f",
            border: "none",
            borderRadius: "16px",
            padding: "16px",
            color: "#fff",
            width: "200px",
            textAlign: "center",
          }}
          formatter={(value, _name, props: SingleTooltipProps) => {
            const name = props.payload?.name ?? "Score";
            return [
              <div key="tooltip">
                <div className="font-semibold text-white">
                  {name} : {value}
                </div>
              </div>,
            ];
          }}
        />
        <Bar
          dataKey="score"
          radius={[28, 28, 0, 0]}
          animationDuration={1200}
          animationEasing="ease-out"
        >
          {chartData.map((_, i) => (
            <Cell key={i} fill="url(#creditGradient)" />
          ))}
        </Bar>
        <defs>
          <linearGradient id="creditGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dc425f" />
            <stop offset="100%" stopColor="#6c1b2a" />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ScoreTracker;
