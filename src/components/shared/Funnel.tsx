import React from "react";

type FunnelStep = {
  step: number;
  title: string;
  subtitle: string;
  value: number;
  percentOfTotal: string;
  convertRate?: string;
  bg: string;
  badgeColor: string;
};

interface FunnelProps {
  steps: FunnelStep[];
}

const Funnel: React.FC<FunnelProps> = ({ steps }) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-0 relative">
      {steps.map((item, idx) => {
        const widthPercentage = 100 - idx * 10;
        const widthStyle = { width: `${widthPercentage}%` };

        return (
          <div key={idx} className="relative mx-auto pb-6">
            {/* Funnel Block */}
            <br></br>
            <div
              style={widthStyle}
              className={`bg-[#c5def1] mx-auto rounded-t-[8px]   p-6 md:p-5 flex items-center justify-between relative`}
            >
              {/* Convert Badge — Centered Inside Bar */}
              {item.convertRate && (
                <span
                  className={`absolute left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full text-xs md:text-sm font-medium
                  ${
                    item.convertRate !== "—"
                      ? "text-green-600 border border-green-300"
                      : "text-gray-600 border border-gray-300"
                  }
                `}
                  style={{ top: "50%", transform: "translate(-50%, -50%)" }}
                >
                  {item.convertRate} convert
                </span>
              )}

              {/* Left */}
              <div className="flex gap-4 items-center">
                <div
                  className={`w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full text-white font-semibold ${item.badgeColor}`}
                >
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.subtitle}</p>
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-col items-end">
                <span className="text-gray-800 text-3xl font-semibold">
                  {item.value}
                </span>
                <span className="text-xs md:text-sm text-gray-500">
                  {item.percentOfTotal}
                </span>
              </div>
            </div>

            {/* Bottom Center Block Connector */}

            {/* Trapezoid Connector */}
            {idx < steps.length - 1 && (
              <div className="mx-auto relative flex justify-center">
                <div
                  className={`absolute  h-4 w-20  `}
                  style={{
                    zIndex: 1,
                    borderLeft: "1rem solid transparent",
                    borderRight: "1rem solid transparent",
                    borderTop: "1.4rem solid #c5def1",
                    top: "-3px",
                  }}
                ></div>
              </div>
            )}
          </div>
        );
      })}

      {/* Footer */}
      <div className="text-sm text-gray-500 flex justify-between mt-6 pt-4">
        <span className="text-base text-gray-700">
          Key Insight: The largest drop-off occurs between{" "}
          <b className="font-bold">
            Treatment Presented and Treatment Accepted (17.6%)
          </b>
        </span>

        <button className="text-blue-600 font-medium hover:underline">
          View Detailed Analysis
        </button>
      </div>
    </div>
  );
};

export default Funnel;
