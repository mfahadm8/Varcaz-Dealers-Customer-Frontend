import { CalendarClock, CircleCheck, CircleHelp, CircleSlash, Clock3, Eye, Pause, Play } from "lucide-react";

export const queueStatuses = {
  needs_review: { label: "Needs review", icon: Eye, color: "rgb(var(--color-status-orange))" },
  held: { label: "On hold", icon: Pause, color: "rgb(var(--color-primary-500))" },
  overdue: { label: "Overdue", icon: CalendarClock, color: "rgb(var(--color-primary-700))" },
  pending: { label: "Pending", icon: Clock3, color: "rgb(var(--color-status-yellow))" },
  in_progress: { label: "In progress", icon: Play, color: "rgb(var(--color-status-orange))" },
  completed: { label: "Completed", icon: CircleCheck, color: "rgb(var(--color-secondary-500))" },
  closed: { label: "Closed", icon: CircleSlash, color: "rgb(var(--color-neutral-500))" },
  unknown: { label: "Status unknown", icon: CircleHelp, color: "rgb(var(--color-neutral-200))" },
} as const;

export type CoachingQueueStatus = keyof typeof queueStatuses;

export function isQueueStatus(value: string): value is CoachingQueueStatus {
  return Object.prototype.hasOwnProperty.call(queueStatuses, value);
}

export const queueStatusOrder = Object.keys(queueStatuses).filter(isQueueStatus);

