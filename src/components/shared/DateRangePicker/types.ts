// Date Range Picker Types

export interface DateRange {
  from: Date;
  to: Date;
}

export interface GuideVersion {
  id: string;
  name: string;
  uploadedAt: Date;
  isActive: boolean;
}

export interface DateRangeValidation {
  isValid: boolean;
  warning?: string;
  adjustedRange?: DateRange;
  guideVersionsInRange: GuideVersion[];
}

export interface DateRangePickerConfig {
  minDate?: Date;
  maxDate?: Date;
  guideVersions?: GuideVersion[];
  callCount?: number | null;
  showCallCount?: boolean;
  placeholder?: string;
}

export interface DateRangePickerState {
  isOpen: boolean;
  selectedRange: DateRange;
  tempRange: DateRange;
  validation: DateRangeValidation;
  callCount: number | null;
}

// Format helpers
export const formatDateRange = (range: DateRange): string => {
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  const fromStr = range.from.toLocaleDateString("en-US", options);
  const toStr = range.to.toLocaleDateString("en-US", options);

  // If same month and year, combine
  if (range.from.getMonth() === range.to.getMonth() &&
      range.from.getFullYear() === range.to.getFullYear()) {
    const month = range.from.toLocaleDateString("en-US", { month: "short" });
    const year = range.from.getFullYear();
    return `${month} ${range.from.getDate()}-${range.to.getDate()}, ${year}`;
  }

  return `${fromStr} - ${toStr}`;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
};
