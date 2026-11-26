import React from "react";
import { Check } from "lucide-react";

interface Step {
  label: string;
  status: "completed" | "current" | "upcoming";
  stepNumber: number;
}

interface ProgressStepsProps {
  steps: Step[];
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ steps }) => {
  return (
    <div className="w-full flex items-center justify-between px-10 py-6 bg-[#0C0C0C] text-white relative">
      {steps.map((step, index) => (
        <div key={step.stepNumber} className="flex items-center w-full">
          {/* Step Circle */}
          <div className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all duration-300
                ${
                  step.status === "completed"
                    ? "bg-[#55D497] text-black"
                    : step.status === "current"
                    ? "bg-[#E94A57]"
                    : "border border-gray-500 text-gray-400"
                }`}
            >
              {step.status === "completed" ? (
                <Check className="w-5 h-5" />
              ) : step.status === "current" ? (
                <div className="w-3 h-3 bg-white rounded-full" />
              ) : (
                step.stepNumber
              )}
            </div>

            {/* Step Label */}
            <span
              className={`mt-3 text-sm font-medium text-center ${
                step.status === "current"
                  ? "text-white font-semibold"
                  : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>

          {/* Connecting Line */}
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-[1px] mx-4 transition-all duration-300 ${
                step.status === "completed"
                  ? "bg-[#55D497]"
                  : step.status === "current"
                  ? "bg-[#E94A57]/50"
                  : "bg-gray-700"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressSteps;
