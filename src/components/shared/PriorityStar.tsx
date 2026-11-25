import React from "react";

interface PriorityStarProps {
  filled: boolean;
  onClick: () => void;
  label?: string;
}

export const PriorityStar: React.FC<PriorityStarProps> = ({ filled, onClick, label }) => (
  <button
    type="button"
    aria-pressed={filled}
    aria-label={label ?? (filled ? "Remove from priority" : "Mark as priority")}
    className={`cursor-pointer text-sm transition-transform hover:scale-110 ${
      filled ? "text-status-yellow" : "text-neutral-150"
    }`}
    onClick={onClick}
  >
    ★
  </button>
);
