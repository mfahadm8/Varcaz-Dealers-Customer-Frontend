/**
 * Checkbox - Reusable checkbox component with custom styling
 */

import { Check } from "lucide-react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  className?: string;
}

export function Checkbox({
  checked,
  onChange,
  label,
  description,
  className = "",
}: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center gap-3 p-3 text-left bg-neutral-50 rounded-lg cursor-pointer hover:bg-neutral-100 transition-colors ${className}`}
    >
      <div
        className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
          checked
            ? "bg-secondary-500"
            : "bg-white border-2 border-neutral-300"
        }`}
      >
        {checked && <Check className="w-3.5 h-3.5 text-white" />}
      </div>
      {(label || description) && (
        <div>
          {label && <p className="body-sm !font-medium !text-neutral-900">{label}</p>}
          {description && <p className="body-xs !text-neutral-500">{description}</p>}
        </div>
      )}
    </button>
  );
}
