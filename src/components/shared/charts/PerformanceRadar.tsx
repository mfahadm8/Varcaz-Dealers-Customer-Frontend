import React from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

interface RadarDataPoint {
  metric: string;
  value: number;
  fullMark?: number;
}

interface PerformanceRadarProps {
  data: RadarDataPoint[];
  height?: number;
}

export const PerformanceRadar: React.FC<PerformanceRadarProps> = ({
  data,
  height = 300,
}) => {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          data={data}
          outerRadius="69%"
          margin={{ top: 18, right: 28, bottom: 18, left: 28 }}
        >
          <PolarGrid stroke="#D1D5DB" gridType="polygon" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: "#374151", fontSize: 11, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            tickCount={5}
            axisLine={false}
          />
          <Radar
            name="Performance"
            dataKey="value"
            stroke="#5E9F2D"
            fill="#9FD36A"
            fillOpacity={0.52}
            strokeWidth={2.25}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceRadar;
