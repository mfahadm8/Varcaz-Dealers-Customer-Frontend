// import React from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";

// const BarsGraph = () => {
//   const data = [
//     { month: "02/23", Equifax: 610, Experian: 620, TransUnion: 605 },
//     { month: "03/23", Equifax: 640, Experian: 625, TransUnion: 615 },
//     { month: "04/23", Equifax: 660, Experian: 640, TransUnion: 635 },
//     { month: "05/23", Equifax: 620, Experian: 615, TransUnion: 610 },
//     { month: "06/23", Equifax: 590, Experian: 600, TransUnion: 595 },
//     { month: "07/23", Equifax: 630, Experian: 625, TransUnion: 615 },
//     { month: "08/23", Equifax: 650, Experian: 640, TransUnion: 625 },
//     { month: "09/23", Equifax: 670, Experian: 655, TransUnion: 645 },
//     { month: "10/23", Equifax: 710, Experian: 680, TransUnion: 660 },
//     { month: "11/23", Equifax: 700, Experian: 675, TransUnion: 655 },
//     { month: "12/23", Equifax: 705, Experian: 665, TransUnion: 640 },
//     { month: "02/24", Equifax: 720, Experian: 700, TransUnion: 680 },
//   ];

//   return (
//     <section className="p-6 bg-white rounded-2xl shadow-md">
//       <h2 className="text-xl font-semibold text-neutral-900 mb-4">
//         Score Tracker
//       </h2>

//       <div className="w-full h-[400px] md:h-[500px]">
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart
//             data={data}
//             margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
//           >
//             <CartesianGrid
//               strokeDasharray="2 2"
//               stroke="#f0f0f0"
//               vertical={false}
//             />

//             <XAxis
//               dataKey="month"
//               tick={{ fill: "#afadab", fontSize: 12 }}
//               axisLine={false}
//               tickLine={false}
//               padding={{ left: 10, right: 10 }}
//             />

//             <YAxis
//               tick={{ fill: "#afadab", fontSize: 12 }}
//               axisLine={false}
//               tickLine={false}
//               domain={[580, 740]}
//             />

//             <Tooltip
//               cursor={{ fill: "rgba(0,0,0,0.03)" }}
//               contentStyle={{
//                 backgroundColor: "#fff",
//                 borderRadius: "12px",
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//                 border: "1px solid #f0f0f0",
//                 padding: "10px 14px",
//               }}
//               formatter={(value, name) => [`${value}`, name]}
//               labelStyle={{ color: "#888", fontSize: "12px" }}
//             />

//             {/* Equifax */}
//             <Bar
//               dataKey="Equifax"
//               name="Equifax"
//               fill="var(--color-credit-equifax)"
//               barSize={20}
//               radius={[8, 8, 0, 0]}
//             />
//             {/* Experian */}
//             <Bar
//               dataKey="Experian"
//               name="Experian"
//               fill="var(--color-credit-experian)"
//               barSize={20}
//               radius={[8, 8, 0, 0]}
//             />
//             {/* TransUnion */}
//             <Bar
//               dataKey="TransUnion"
//               name="TransUnion"
//               fill="var(--color-credit-transunion)"
//               barSize={20}
//               radius={[8, 8, 0, 0]}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </section>
//   );
// };

// export default BarsGraph;
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type AxisBound = number | "auto";

interface BarGraphProps {
  maxBarSize?: number;
  allowDecimals?: boolean;
  isAnimationActive?: boolean;
  /** Chart data array */
  data: Record<string, string | number>[];
  /** X-axis key (e.g. "month", "date") */
  xKey: string;
  /** Array of bars with dataKey + color */
  bars: { key: string; color: string; name?: string }[];
  formatValue?: (value: number) => string;
  /** Optional: Y-axis range */
  yDomain?: [AxisBound, AxisBound];
  /** Optional: chart height */
  height?: number;
  /** Called when a visible data point is selected. */
  onDataPointClick?: (point: Record<string, string | number>) => void;
}

const BarGraph: React.FC<BarGraphProps> = ({
  data,
  xKey,
  bars,
  yDomain = [0, "auto"],
  height = 400,
  onDataPointClick,
  isAnimationActive = true,
  maxBarSize,
  allowDecimals,
  formatValue,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} barCategoryGap={9}>
        <CartesianGrid
          strokeDasharray="2 2"
          stroke="#f0f0f0"
          vertical={false}
        />

        <XAxis
          dataKey={xKey}
          tick={{ fill: "#afadab", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          allowDecimals={allowDecimals}
          tickFormatter={formatValue}
          tick={{ fill: "#afadab", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          domain={yDomain}
        />

        <Tooltip
          cursor={{ fill: "rgba(0,0,0,0.03)" }}
          contentStyle={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            border: "1px solid #f0f0f0",
            padding: "10px 14px",
          }}
          formatter={(value, name) => [formatValue && typeof value === "number" ? formatValue(value) : String(value), name]}
          labelStyle={{ color: "#888", fontSize: "12px" }}
        />

        {bars.map((bar) => (
          <Bar
            maxBarSize={maxBarSize}
            key={bar.key}
            isAnimationActive={isAnimationActive}
            dataKey={bar.key}
            name={bar.name ?? bar.key}
            fill={bar.color}
            radius={[8, 8, 0, 0]}
            cursor={onDataPointClick ? "pointer" : undefined}
            onClick={(entry) =>
              onDataPointClick?.(
                ((entry as {
                  payload?: Record<string, string | number>;
                }).payload ?? entry) as Record<string, string | number>,
              )
            }
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarGraph;
