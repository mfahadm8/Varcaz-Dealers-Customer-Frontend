/**
 * SecureInput — Password-style input with show/hide toggle.
 * Used for API keys, secrets, and other sensitive credential fields.
 */

import { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

interface SecureInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Error message to display */
  error?: string;
}

export const SecureInput = forwardRef<HTMLInputElement, SecureInputProps>(
  ({ error, className = "", ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="relative">
        <input
          ref={ref}
          type={visible ? "text" : "password"}
          className={`w-full px-4 py-3 pr-10 bg-white rounded-md border text-neutral-800 text-[14px] transition-colors duration-200 outline-none
            placeholder:text-neutral-200 placeholder:font-[300]
            ${error ? "border-status-error" : "border-neutral-100 focus:border-secondary-500"}
            ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
          tabIndex={-1}
          aria-label={visible ? "Hide value" : "Show value"}
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
        {error && (
          <p className="mt-1 text-xs text-status-error">{error}</p>
        )}
      </div>
    );
  },
);

SecureInput.displayName = "SecureInput";

/**
 * PEMInput — Textarea for PEM-format private keys (Vonage).
 */

interface PEMInputProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "type"> {
  error?: string;
}

export const PEMInput = forwardRef<HTMLTextAreaElement, PEMInputProps>(
  ({ error, className = "", ...props }, ref) => {
    return (
      <div>
        <textarea
          ref={ref}
          rows={6}
          className={`w-full px-4 py-3 bg-white rounded-md border text-[13px] font-mono resize-none transition-colors duration-200 outline-none
            placeholder:text-neutral-200 placeholder:font-[300]
            ${error ? "border-status-error" : "border-neutral-100 focus:border-secondary-500"}
            ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-status-error">{error}</p>
        )}
      </div>
    );
  },
);

PEMInput.displayName = "PEMInput";
