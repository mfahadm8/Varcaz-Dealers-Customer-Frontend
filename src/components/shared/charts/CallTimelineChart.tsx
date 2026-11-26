import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";

interface CallTimelineDataPoint {
  date: string;
  score: number;
  callId: string;
  duration?: string;
  outcome?: "success" | "warning" | "failure";
}

interface CallTimelineChartProps {
  data: CallTimelineDataPoint[];
  height?: number;
  showAverage?: boolean;
  averageValue?: number;
  onBarClick?: (data: CallTimelineDataPoint) => void;
}

const getBarColor = (score: number): string => {
  if (score >= 85) return "var(--color-secondary-500)";
  if (score >= 70) return "var(--color-status-yellow)";
  return "var(--color-primary-500)";
};

interface CallTimelineTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: CallTimelineDataPoint }>;
}

const CustomTooltip = ({ active, payload }: CallTimelineTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as CallTimelineDataPoint;
    return (
      <div className="bg-neutral-900 border border-white/10 rounded-lg px-4 py-3 shadow-xl min-w-[160px]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/60">Call ID</span>
          <span className="text-xs font-medium text-white">{data.callId}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/60">Date</span>
          <span className="text-xs font-medium text-white">{data.date}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/60">Score</span>
          <span
            className="text-sm font-bold"
            style={{ color: getBarColor(data.score) }}
          >
            {data.score}%
          </span>
        </div>
        {data.duration && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">Duration</span>
            <span className="text-xs font-medium text-white">{data.duration}</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const CallTimelineChart: React.FC<CallTimelineChartProps> = ({
  data,
  height = 200,
  showAverage = true,
  averageValue,
  onBarClick,
}) => {
  const calculatedAverage =
    averageValue ??
    (data.length > 0
      ? Math.round(data.reduce((acc, d) => acc + d.score, 0) / data.length)
      : 0);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255, 255, 255, 0.06)"
          vertical={false}
        />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tick={{
            fill: "rgba(255, 255, 255, 0.6)",
            fontSize: 10,
            fontWeight: 500,
          }}
          dy={10}
        />
        <YAxis
          domain={[0, 100]}
          axisLine={false}
          tickLine={false}
          tick={{
            fill: "rgba(255, 255, 255, 0.5)",
            fontSize: 10,
          }}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255, 255, 255, 0.05)" }} />
        {showAverage && (
          <ReferenceLine
            y={calculatedAverage}
            stroke="rgba(255, 255, 255, 0.3)"
            strokeDasharray="5 5"
            label={{
              value: `Avg: ${calculatedAverage}%`,
              position: "right",
              fill: "rgba(255, 255, 255, 0.6)",
              fontSize: 10,
            }}
          />
        )}
        <Bar
          dataKey="score"
          radius={[4, 4, 0, 0]}
          barSize={24}
          cursor={onBarClick ? "pointer" : "default"}
          onClick={(data) => onBarClick?.(data as unknown as CallTimelineDataPoint)}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CallTimelineChart;
