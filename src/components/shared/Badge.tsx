/**
 * Badge - Reusable badge/chip component for status and role indicators
 *
 * Features:
 * - Multiple variants (status, role)
 * - Icon support
 * - Consistent styling
 */

import { cn } from "@/utils/cn";
import { CheckCircle, Clock, XCircle } from "lucide-react";

export type BadgeVariant = "status" | "role";
export type BadgeColor =
  | "success"
  | "warning"
  | "error"
  | "neutral"
  | "primary";

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  color?: BadgeColor;
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "role",
  color = "neutral",
  icon,
  className = "",
}) => {
  const baseStyles = "inline-flex items-center gap-1 font-medium";

  const variantStyles = {
    status: "px-2 py-1 rounded-sm text-xs",
    role: "px-3 py-1 rounded-sm text-xs",
  };

  const colorStyles = {
    success: "bg-secondary-100/30 text-secondary-500",
    warning: "bg-amber-50 text-amber-600",
    error: "bg-status-red-10 text-primary-500",
    neutral: "bg-neutral-100 text-neutral-700",
    primary: "bg-secondary-100/30 text-secondary-500",
  };

  return (
    <span
      className={cn(
        baseStyles,
        variantStyles[variant],
        colorStyles[color],
        className
      )}
    >
      {icon && icon}
      {label}
    </span>
  );
};

// Specialized Status Badge
export interface StatusBadgeProps {
  status: "active" | "pending" | "inactive";
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
}) => {
  const config = {
    active: {
      icon: <CheckCircle className="w-3 h-3" />,
      label: "Active",
      color: "success" as BadgeColor,
    },
    pending: {
      icon: <Clock className="w-3 h-3" />,
      label: "Pending",
      color: "warning" as BadgeColor,
    },
    inactive: {
      icon: <XCircle className="w-3 h-3" />,
      label: "Inactive",
      color: "error" as BadgeColor,
    },
  };

  const { icon, label, color } = config[status];

  return (
    <Badge
      label={label}
      variant="status"
      color={color}
      icon={icon}
      className={className}
    />
  );
};

// Specialized Role Badge
export interface RoleBadgeProps {
  role: "agent" | "manager" | "client_admin";
  className?: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, className }) => {
  const config = {
    agent: { label: "Agent", color: "neutral" as BadgeColor },
    manager: { label: "Manager", color: "primary" as BadgeColor },
    client_admin: { label: "Admin", color: "primary" as BadgeColor },
  };

  const { label, color } = config[role];

  return (
    <Badge label={label} variant="role" color={color} className={className} />
  );
};

export default Badge;
