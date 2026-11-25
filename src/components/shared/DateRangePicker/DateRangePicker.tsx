import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  X,
  AlertTriangle,
  FileText,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useDateRangePicker } from "./useDateRangePicker";
import { formatDateRange, formatDate } from "./types";
import type { DateRangePickerConfig } from "./types";

interface DateRangePickerProps {
  config?: DateRangePickerConfig;
  className?: string;
  onChange?: (range: { from: Date; to: Date }) => void;
}

// Simple date input component
const DateInput: React.FC<{
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  min?: Date;
  max?: Date;
}> = ({ label, value, onChange, min, max }) => {
  const formatForInput = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="flex-1">
      <label className="block text-sm font-bold text-white/60 uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="date"
          value={formatForInput(value)}
          min={min ? formatForInput(min) : undefined}
          max={max ? formatForInput(max) : undefined}
          onChange={(e) => {
            const newDate = new Date(e.target.value);
            if (!isNaN(newDate.getTime())) {
              onChange(newDate);
            }
          }}
          className={cn(
            "w-full px-4 py-3 rounded-md",
            "bg-neutral-800 border border-white/10",
            "text-white text-sm font-medium",
            "focus:outline-none focus:ring-2 focus:ring-secondary-500/30 focus:border-secondary-500/50",
            "transition-all duration-200",
            "[color-scheme:dark]"
          )}
        />
      </div>
    </div>
  );
};

// Preset button component
const PresetButton: React.FC<{
  label: string;
  onClick: () => void;
  isActive?: boolean;
}> = ({ label, onClick, isActive }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
      isActive
        ? "bg-secondary-500 text-white"
        : "bg-white/10 text-white/80 hover:bg-white/15 hover:text-white"
    )}
  >
    {label}
  </button>
);

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  config,
  className,
  onChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    isOpen,
    selectedRange,
    tempRange,
    validation,
    callCount,
    guideAtRangeStart,
    openPicker,
    closePicker,
    setFromDate,
    setToDate,
    applySelection,
    cancelSelection,
    selectPreset,
    config: mergedConfig,
  } = useDateRangePicker(config);

  const handleApply = () => {
    applySelection();
    if (onChange) {
      const rangeToApply = validation.adjustedRange || tempRange;
      onChange(rangeToApply);
    }
  };

  // Helper to check if a preset matches the current temp range
  const isPresetActive = (
    preset: "today" | "last7days" | "last14days" | "last30days" | "thisMonth"
  ): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const fromDate = new Date(tempRange.from);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(tempRange.to);
    toDate.setHours(0, 0, 0, 0);

    const isSameDay = (d1: Date, d2: Date) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    switch (preset) {
      case "today":
        return isSameDay(fromDate, today) && isSameDay(toDate, today);
      case "last7days": {
        const expected = new Date(today);
        expected.setDate(expected.getDate() - 7);
        return isSameDay(fromDate, expected) && isSameDay(toDate, today);
      }
      case "last14days": {
        const expected = new Date(today);
        expected.setDate(expected.getDate() - 14);
        return isSameDay(fromDate, expected) && isSameDay(toDate, today);
      }
      case "last30days": {
        const expected = new Date(today);
        expected.setDate(expected.getDate() - 30);
        return isSameDay(fromDate, expected) && isSameDay(toDate, today);
      }
      case "thisMonth": {
        const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return isSameDay(fromDate, firstOfMonth) && isSameDay(toDate, today);
      }
      default:
        return false;
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={openPicker}
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 rounded-lg",
          "bg-neutral-800 hover:bg-neutral-700",
          "border border-white/10 hover:border-white/20",
          "transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-secondary-500/30",
          className
        )}
      >
        <Calendar className="w-4 h-4 text-white/60" />
        <span className="text-sm font-medium text-white/80">
          {formatDateRange(selectedRange)}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-white/40" />
      </button>

      {/* Date Picker Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[100] bg-black/90 backdro p-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePicker}
            />

            {/* Modal */}
            <motion.div
              ref={containerRef}
              className="fixed z-[101] top-[10%] left-1/2 -translate-x-1/2 w-full max-w-md px-4"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="bg-neutral-900 rounded-xl shadow-2xl overflow-hidden border border-white/10">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-800 rounded-md flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white/60" />
                    </div>
                    <h3 className="text-base font-semibold text-white">
                      Select Date Range
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={closePicker}
                    className="w-8 h-8 rounded-md bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-white/60" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col gap-5">
                  {/* Quick Presets */}
                  <div className="flex flex-wrap gap-2">
                    <PresetButton
                      label="Today"
                      onClick={() => selectPreset("today")}
                      isActive={isPresetActive("today")}
                    />
                    <PresetButton
                      label="Last 7 days"
                      onClick={() => selectPreset("last7days")}
                      isActive={isPresetActive("last7days")}
                    />
                    <PresetButton
                      label="Last 14 days"
                      onClick={() => selectPreset("last14days")}
                      isActive={isPresetActive("last14days")}
                    />
                    <PresetButton
                      label="Last 30 days"
                      onClick={() => selectPreset("last30days")}
                      isActive={isPresetActive("last30days")}
                    />
                    <PresetButton
                      label="This month"
                      onClick={() => selectPreset("thisMonth")}
                      isActive={isPresetActive("thisMonth")}
                    />
                  </div>

                  {/* Date Inputs */}
                  <div className="flex gap-4">
                    <DateInput
                      label="From"
                      value={tempRange.from}
                      onChange={setFromDate}
                      min={mergedConfig.minDate}
                      max={tempRange.to}
                    />
                    <DateInput
                      label="To"
                      value={tempRange.to}
                      onChange={setToDate}
                      min={tempRange.from}
                      max={mergedConfig.maxDate}
                    />
                  </div>

                  {/* Guide Info */}
                  {guideAtRangeStart && (
                    <div className="flex items-start gap-3 p-4 bg-secondary-500 rounded-md border border-secondary-500/20">
                      <FileText className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-white">
                          Guide uploaded:{" "}
                          {formatDate(guideAtRangeStart.uploadedAt)}
                        </p>
                        <p className="text-[11px] text-white/80 mt-0.5">
                          {guideAtRangeStart.name}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Validation Warning */}
                  {validation.warning && (
                    <div className="flex items-start gap-3 p-4 bg-status-orange/20 rounded-md border border-status-orange/20">
                      <AlertTriangle className="w-4 h-4 text-status-orange mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-status-orange">
                          Guide Version Change Detected
                        </p>
                        <p className="text-[11px] text-white/80 mt-1 leading-relaxed">
                          {validation.warning}
                        </p>
                        {validation.adjustedRange && (
                          <p className="text-[11px] font-semibold text-white mt-2">
                            Adjusted to:{" "}
                            {formatDateRange(validation.adjustedRange)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Selected Summary */}
                  <div className="flex items-center justify-between p-4 bg-neutral-800 rounded-md">
                    <div>
                      <p className="text-sm font-bold text-white/60 uppercase tracking-wider">
                        Selected Range
                      </p>
                      <p className="text-sm font-semibold text-white mt-1">
                        {formatDateRange(validation.adjustedRange || tempRange)}
                      </p>
                    </div>
                    {mergedConfig.showCallCount && (
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">
                          Calls
                        </p>
                        <p className="text-sm font-semibold text-secondary-500  mt-1">
                          {callCount === null ? "Not loaded" : callCount.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-white/10 bg-neutral-850">
                  <button
                    type="button"
                    onClick={cancelSelection}
                    className="px-4 py-2.5 text-sm font-medium text-white/80 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleApply}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-secondary-500 hover:bg-secondary-600 rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DateRangePicker;
