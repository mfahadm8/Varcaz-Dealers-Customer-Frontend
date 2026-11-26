import React from "react";

type StatusType = "error" | "success" | "neutral" | "warning";

interface StatusChipProps {
  label: string;
  status: StatusType;
  className?: string;
}

const StatusChip: React.FC<StatusChipProps> = ({
  label,
  status,
  className = "",
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case "error":
        return {
          container: "bg-status-red-10",
          dot: "bg-primary-500",
          text: "text-neutral-800",
        };
      case "success":
        return {
          container: "bg-secondary-500/20",
          dot: "bg-secondary-500",
          text: "!text-secondary-500",
        };
      case "warning":
        return {
          container: "bg-status-yellow-10",
          dot: "bg-status-yellow",
          text: "text-neutral-800",
        };
      case "neutral":
      default:
        return {
          container: "bg-neutral-100",
          dot: "bg-neutral-400",
          text: "text-neutral-800",
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <div
      className={`${styles.container} rounded-sm px-2 py-1 flex items-center gap-1.5 w-fit ${className}`}
    >
      <div className={`${styles.dot} rounded-full w-2 h-2 flex-shrink-0`} />
      <span className={`body-xs ${styles.text} whitespace-nowrap`}>
        {label}
      </span>
    </div>
  );
};

export default StatusChip;
