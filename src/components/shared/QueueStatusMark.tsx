import { queueStatuses, type CoachingQueueStatus } from "./queueStatus";

export function QueueStatusMark({ status }: { status: CoachingQueueStatus }) {
  const { icon: Icon, color } = queueStatuses[status];
  return <span aria-hidden="true" className="inline-flex size-6 shrink-0 items-center justify-center rounded-full"
    style={{ backgroundColor: color, color: status === "overdue" || status === "closed" ? "white" : "rgb(var(--color-neutral-900))" }}>
    <Icon size={14} strokeWidth={2.4} />
  </span>;
}
