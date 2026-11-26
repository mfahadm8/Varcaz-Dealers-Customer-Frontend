import { useState, useCallback, useMemo } from "react";
import type {
  DateRange,
  DateRangePickerConfig,
  DateRangePickerState,
  DateRangeValidation,
} from "./types";
import { formatDate } from "./types";

const defaultConfig: DateRangePickerConfig = {
  minDate: new Date("2025-01-01"),
  maxDate: new Date(),
  guideVersions: [],
  callCount: null,
  showCallCount: true,
  placeholder: "Select date range",
};

// Get default range (last 14 days)
const getDefaultRange = (): DateRange => {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 14);
  return { from, to };
};

export function useDateRangePicker(config: DateRangePickerConfig = {}) {
  const mergedConfig = { ...defaultConfig, ...config };
  const defaultRange = getDefaultRange();

  const [state, setState] = useState<DateRangePickerState>({
    isOpen: false,
    selectedRange: defaultRange,
    tempRange: defaultRange,
    validation: { isValid: true, guideVersionsInRange: [] },
    callCount: mergedConfig.callCount ?? null,
  });

  // Validate date range against guide versions
  const validateRange = useCallback(
    (range: DateRange): DateRangeValidation => {
      const guideVersions = mergedConfig.guideVersions || [];

      // Find guide versions that fall within the selected range
      const versionsInRange = guideVersions.filter((guide) => {
        const guideDate = guide.uploadedAt.getTime();
        return guideDate > range.from.getTime() && guideDate <= range.to.getTime();
      });

      if (versionsInRange.length > 0) {
        // Guide was updated during this period
        const latestChangeInRange = versionsInRange.reduce((latest, current) =>
          current.uploadedAt > latest.uploadedAt ? current : latest
        );

        // Adjust range to before the guide change
        const adjustedTo = new Date(latestChangeInRange.uploadedAt);
        adjustedTo.setDate(adjustedTo.getDate() - 1);

        return {
          isValid: false,
          warning: `Your guide was updated on ${formatDate(latestChangeInRange.uploadedAt)}. Calls before and after are evaluated using different criteria. We recommend analyzing them separately.`,
          adjustedRange: {
            from: range.from,
            to: adjustedTo,
          },
          guideVersionsInRange: versionsInRange,
        };
      }

      return {
        isValid: true,
        guideVersionsInRange: [],
      };
    },
    [mergedConfig.guideVersions]
  );

  // Get the active guide info
  const activeGuide = useMemo(() => {
    const guides = mergedConfig.guideVersions || [];
    return guides.find((g) => g.isActive) || guides[guides.length - 1];
  }, [mergedConfig.guideVersions]);

  // Get the guide that was active at the start of the range
  const guideAtRangeStart = useMemo(() => {
    const guides = mergedConfig.guideVersions || [];
    // Sort by upload date descending
    const sortedGuides = [...guides].sort(
      (a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()
    );

    // Find the first guide that was uploaded before or on the from date
    return sortedGuides.find(
      (g) => g.uploadedAt.getTime() <= state.tempRange.from.getTime()
    );
  }, [mergedConfig.guideVersions, state.tempRange.from]);

  // Open picker
  const openPicker = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: true,
      tempRange: prev.selectedRange,
      validation: validateRange(prev.selectedRange),
      callCount: mergedConfig.callCount ?? null,
    }));
  }, [mergedConfig.callCount, validateRange]);

  // Close picker
  const closePicker = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Update temp range (while picker is open)
  const setTempRange = useCallback(
    (range: DateRange) => {
      const validation = validateRange(range);

      setState((prev) => ({
        ...prev,
        tempRange: range,
        validation,
        callCount: mergedConfig.callCount ?? null,
      }));
    },
    [mergedConfig.callCount, validateRange]
  );

  // Update from date
  const setFromDate = useCallback(
    (date: Date) => {
      setState((prev) => {
        const newRange = { ...prev.tempRange, from: date };
        // Ensure from is not after to
        if (date > prev.tempRange.to) {
          newRange.to = date;
        }
        const validation = validateRange(newRange);

        return {
          ...prev,
          tempRange: newRange,
          validation,
          callCount: mergedConfig.callCount ?? null,
        };
      });
    },
    [mergedConfig.callCount, validateRange]
  );

  // Update to date
  const setToDate = useCallback(
    (date: Date) => {
      setState((prev) => {
        const newRange = { ...prev.tempRange, to: date };
        // Ensure to is not before from
        if (date < prev.tempRange.from) {
          newRange.from = date;
        }
        const validation = validateRange(newRange);

        return {
          ...prev,
          tempRange: newRange,
          validation,
          callCount: mergedConfig.callCount ?? null,
        };
      });
    },
    [mergedConfig.callCount, validateRange]
  );

  // Apply selection
  const applySelection = useCallback(() => {
    setState((prev) => {
      // Use adjusted range if there's a validation warning
      const rangeToApply = prev.validation.adjustedRange || prev.tempRange;
      return {
        ...prev,
        selectedRange: rangeToApply,
        tempRange: rangeToApply,
        isOpen: false,
        callCount: mergedConfig.callCount ?? null,
      };
    });
  }, [mergedConfig.callCount]);

  // Cancel and close
  const cancelSelection = useCallback(() => {
    setState((prev) => ({
      ...prev,
      tempRange: prev.selectedRange,
      isOpen: false,
      validation: validateRange(prev.selectedRange),
    }));
  }, [validateRange]);

  // Quick select presets
  const selectPreset = useCallback(
    (preset: "today" | "last7days" | "last14days" | "last30days" | "thisMonth") => {
      const to = new Date();
      const from = new Date();

      switch (preset) {
        case "today":
          // from is already today
          break;
        case "last7days":
          from.setDate(from.getDate() - 7);
          break;
        case "last14days":
          from.setDate(from.getDate() - 14);
          break;
        case "last30days":
          from.setDate(from.getDate() - 30);
          break;
        case "thisMonth":
          from.setDate(1);
          break;
      }

      setTempRange({ from, to });
    },
    [setTempRange]
  );

  return {
    // State
    isOpen: state.isOpen,
    selectedRange: state.selectedRange,
    tempRange: state.tempRange,
    validation: state.validation,
    callCount: state.callCount,
    activeGuide,
    guideAtRangeStart,

    // Actions
    openPicker,
    closePicker,
    setTempRange,
    setFromDate,
    setToDate,
    applySelection,
    cancelSelection,
    selectPreset,

    // Config
    config: mergedConfig,
  };
}

export type UseDateRangePickerReturn = ReturnType<typeof useDateRangePicker>;
