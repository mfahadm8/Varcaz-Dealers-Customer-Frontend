import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  presets?: {
    label: string;
    value: Date;
  }[];
  anchor?: "left" | "right";
}

/**
 * DatePicker - Reusable date picker component
 *
 * @param value - Selected date
 * @param onChange - Date change handler
 * @param placeholder - Placeholder text (default: "Select date")
 * @param className - Additional CSS classes
 * @param minDate - Minimum selectable date
 * @param maxDate - Maximum selectable date
 * @param disabled - Disabled state
 * @param presets - Quick date presets (e.g., Today, Yesterday, Last 7 days)
 * @param anchor - Dropdown anchor position: "left" (default) or "right"
 *
 * @example
 * ```tsx
 * <DatePicker
 *   value={selectedDate}
 *   onChange={setSelectedDate}
 *   presets={[
 *     { label: "Today", value: new Date() },
 *     { label: "Yesterday", value: new Date(Date.now() - 86400000) }
 *   ]}
 * />
 * ```
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date",
  className = "",
  minDate,
  maxDate,
  disabled = false,
  presets = [
    { label: "Today", value: new Date() },
    { label: "Yesterday", value: new Date(Date.now() - 86400000) },
    { label: "Last 7 days", value: new Date(Date.now() - 7 * 86400000) },
    { label: "Last 30 days", value: new Date(Date.now() - 30 * 86400000) },
  ],
  anchor = "right",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Format date for display
  const formatDate = (date: Date | undefined): string => {
    if (!date) return placeholder;
    const today = new Date();
    const yesterday = new Date(Date.now() - 86400000);

    if (isSameDay(date, today)) return "Today";
    if (isSameDay(date, yesterday)) return "Yesterday";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  // Get calendar days for current month
  const getCalendarDays = (): (Date | null)[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: (Date | null)[] = [];

    // Add empty slots for days before the first day
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days in the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    onChange?.(date);
    setIsOpen(false);
  };

  // Handle preset selection
  const handlePresetSelect = (presetDate: Date) => {
    onChange?.(presetDate);
    setIsOpen(false);
  };

  // Navigate months
  const handlePreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const calendarDays = getCalendarDays();
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "bg-neutral-50 rounded-2xl px-4 py-3.5 flex items-center gap-2 transition-colors  w-fit ",
          "hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-secondary-500",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <Calendar className="w-4 h-4 text-neutral-800" />
        <span className="body-sm text-neutral-900">{formatDate(value)}</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={cn(
            "absolute top-full mt-2 bg-white rounded-xl shadow-lg border border-neutral-100 z-50 min-w-[320px]",
            anchor === "left" ? "left-0" : "right-0"
          )}
        >
          {/* Presets */}
          {presets.length > 0 && (
            <div className="p-3 border-b border-neutral-100">
              <div className="flex flex-wrap gap-2">
                {presets.map((preset, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handlePresetSelect(preset.value)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm transition-colors",
                      value && isSameDay(value, preset.value)
                        ? "bg-secondary-500 text-white"
                        : "bg-neutral-50 text-neutral-800 hover:bg-neutral-100"
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Calendar Header */}
          <div className="p-4 flex items-center justify-between border-b border-neutral-100">
            <button
              type="button"
              onClick={handlePreviousMonth}
              className="p-1 hover:bg-neutral-50 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-800" />
            </button>
            <span className="text-base font-medium text-neutral-900">
              {currentMonth.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 hover:bg-neutral-50 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-neutral-800" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="p-4">
            {/* Week days */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-neutral-500 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} />;
                }

                const isSelected = value && isSameDay(day, value);
                const isToday = isSameDay(day, new Date());
                const isDisabled =
                  (minDate && day < minDate) || (maxDate && day > maxDate);

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => !isDisabled && handleDateSelect(day)}
                    disabled={isDisabled}
                    className={cn(
                      "aspect-square rounded-lg text-sm transition-colors",
                      "hover:bg-neutral-50 focus:outline-none",
                      isSelected &&
                        "bg-secondary-500 text-white hover:bg-secondary-600",
                      isToday &&
                        !isSelected &&
                        "border border-secondary-500 text-secondary-500",
                      isDisabled && "text-neutral-200 cursor-not-allowed"
                    )}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
