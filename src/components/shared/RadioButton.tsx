/**
 * RadioButton - Reusable radio button component
 *
 * Features:
 * - Custom styled radio input
 * - Label and description support
 * - Selected state with visual feedback
 * - Follows design system patterns
 */

import { cn } from "@/utils/cn";

export interface RadioButtonProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  name,
  value,
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = "",
}) => {
  return (
    <label
      className={cn(
        "flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all",
        checked
          ? "border-secondary-500"
          : "bg-white border-neutral-100 hover:border-neutral-200",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        disabled={disabled}
        className="mt-0.5 w-4 h-4 appearance-none rounded-full border checked:bg-secondary-500 checked:ring-2 checked:ring-secondary-500 checked:ring-offset-2 focus:outline-none"
      />
      <div className="flex-1">
        <p className="body-sm !font-medium !text-neutral-900">{label}</p>
        {description && <p className="body-xs !text-neutral-500">{description}</p>}
      </div>
    </label>
  );
};

export default RadioButton;
