import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?:
    | "main"
    | "primary"
    | "secondary"
    | "tertiary"
    | "danger"
    | "success";
  size?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  className?: string;
  disabled?: boolean;
  title?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  [dataAttribute: `data-${string}`]: string | number | boolean | undefined;
}

const variantClasses: Record<string, string> = {
  main: "bg-primary-500 text-white hover:bg-primary-600 ",
  primary: "bg-neutral-800 text-white hover:bg-neutral-900 ",
  secondary: "bg-white text-neutral-900   hover:bg-neutral-100",
  tertiary:
    "bg-neutral-50 font-regular text-neutral-900 hover:bg-neutral-100 opacity-80",
  danger: "bg-status-error text-white hover:bg-red-600",
  success: "bg-secondary-500 text-white hover:bg-secondary-700 ",
};

const sizeClasses: Record<string, string> = {
  sm: "h-9 px-3 text-sm rounded-sm",
  lg: "h-12 px-6 text-sm",
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "lg",
  leftIcon,
  rightIcon,
  loading,
  disabled,
  className,
  onClick,
  type = "button",
  ...rest
}) => {
  const isDisabled = disabled || loading;
  const iconColor = ["main", "primary", "danger", "success"].includes(variant)
    ? "text-white"
    : "text-neutral-800";

  return (
    <motion.button
      {...rest}
      type={type}
      disabled={isDisabled}
      onClick={!isDisabled ? (e) => onClick?.(e) : undefined}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg  font-regular tracking-[-0.14px] transition-all duration-200",
        variantClasses[variant],
        sizeClasses[size],
        isDisabled && "opacity-60 cursor-not-allowed",
        className
      )}
    >
      {loading ?? false ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {leftIcon ? (
            <span className={cn("flex h-4 w-4 shrink-0 items-center justify-center [&>svg]:h-4 [&>svg]:w-4", iconColor)}>
              {leftIcon}
            </span>
          ) : null}
          {children}
          {rightIcon ? (
            <span className={cn("flex h-4 w-4 shrink-0 items-center justify-center [&>svg]:h-4 [&>svg]:w-4", iconColor)}>
              {rightIcon}
            </span>
          ) : null}
        </>
      )}
    </motion.button>
  );
};
