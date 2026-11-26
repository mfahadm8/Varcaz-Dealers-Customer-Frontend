/**
 * Dropdown - Reusable dropdown menu component
 */

import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { cn } from "@/utils/cn";

export interface DropdownOption {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
}

interface DropdownProps {
  options: DropdownOption[];
  trigger?: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}

export function Dropdown({
  options,
  trigger,
  align = "right",
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleOptionClick = (option: DropdownOption) => {
    option.onClick();
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-2 hover:bg-neutral-100 rounded-lg transition"
      >
        {trigger || <MoreVertical className="w-4 h-4 text-neutral-500" />}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            "absolute mt-1 w-48 bg-white rounded-lg shadow-lg border border-neutral-100 overflow-hidden py-1 z-50",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {options.map((option, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                handleOptionClick(option);
              }}
              className={cn(
                "w-full px-4 py-2 text-left hover:bg-neutral-50 flex items-center gap-2 !body-sm transition",
                option.variant === "danger"
                  ? "!text-status-error"
                  : "!text-neutral-900"
              )}
            >
              {option.icon && (
                <span className="flex items-center w-4 h-4">{option.icon}</span>
              )}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
