/**
 * OnboardingStepper - Visual stepper for onboarding flow
 *
 * Displays a horizontal stepper with:
 * - Circular numbered steps
 * - Text labels beneath each step
 * - Checkmarks for completed steps
 * - Highlighted current step
 * - Connected lines between steps
 */

import React from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

export interface StepConfig {
  id: number;
  label: string;
  shortLabel?: string; // For mobile
}

interface OnboardingStepperProps {
  steps: StepConfig[];
  currentStep: number;
  className?: string;
}

export const OnboardingStepper: React.FC<OnboardingStepperProps> = ({
  steps,
  currentStep,
  className = "",
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Desktop Stepper */}
      <div className="hidden md:flex items-start justify-center gap-0">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <React.Fragment key={step.id}>
              {/* Step Circle and Label */}
              <div className="flex flex-col items-center" style={{ width: 120 }}>
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold transition-all duration-300 ${
                    isCompleted
                      ? "bg-secondary-500 text-white"
                      : isCurrent
                      ? "bg-primary-500 text-white"
                      : "bg-white border-2 border-neutral-200 text-neutral-400"
                  }`}
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    step.id
                  )}
                </motion.div>
                <p
                  className={`mt-3 text-sm font-medium text-center leading-tight ${
                    isCompleted
                      ? "text-secondary-500"
                      : isCurrent
                      ? "text-neutral-900"
                      : "text-neutral-400"
                  }`}
                >
                  {step.label}
                </p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 flex items-center pt-6" style={{ minWidth: 40, maxWidth: 80 }}>
                  <div
                    className={`h-0.5 w-full transition-colors duration-300 ${
                      currentStep > step.id ? "bg-secondary-500" : "bg-neutral-200"
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile Stepper - Compact */}
      <div className="md:hidden">
        <div className="flex items-center justify-center gap-2 mb-2">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <React.Fragment key={step.id}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                    isCompleted
                      ? "bg-secondary-500 text-white"
                      : isCurrent
                      ? "bg-primary-500 text-white"
                      : "bg-white border border-neutral-200 text-neutral-400"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-6 h-0.5 ${
                      currentStep > step.id ? "bg-secondary-500" : "bg-neutral-200"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
        <p className="text-center text-sm font-medium text-neutral-900">
          {steps.find((s) => s.id === currentStep)?.label}
        </p>
      </div>
    </div>
  );
};

export default OnboardingStepper;
