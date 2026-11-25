import React, { useId, useState, forwardRef } from "react";
import { Info } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helpText?: string;
  error?: string;
  infoTooltip?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helpText,
      error,
      infoTooltip,
      fullWidth = true,
      leftIcon,
      rightIcon,
      className = "",
      containerClassName = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const generatedId = useId();
    const inputId = props.id ?? (label ? generatedId : undefined);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      if (props.onFocus) props.onFocus(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      if (props.onBlur) props.onBlur(e);
    };

    return (
      <div className={`${fullWidth ? "w-full" : ""} ${containerClassName}`}>
        {label && (
          <div className="flex items-center mb-1.5">
            <label
              htmlFor={inputId}
              className=" font-medium text-neutral-800"
            >
              {label}
            </label>
            {infoTooltip && (
              <div className="relative group ml-1.5">
                <Info className="w-4 h-4 text-neutral-500 cursor-help" />
                <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-neutral-800 text-white text-xs rounded-md w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {infoTooltip}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-800"></div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-[50%] transform -translate-y-1/2 text-neutral-500">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            className={`
              w-full px-4 py-3 bg-white 
              placeholder:text-neutral-200 placeholder:font-[300]
              border ${
                error
                  ? "border-status-error"
                  : focused
                  ? "border-secondary-500"
                  : "border-neutral-100"
              } 
              rounded-md text-neutral-800 text-[14px]
              transition-colors duration-200
              outline-none
              ${
                disabled
                  ? "bg-neutral-50 text-neutral-500 cursor-not-allowed"
                  : ""
              }
              ${leftIcon ? "pl-10" : ""}
              ${rightIcon ? "pr-10" : ""}
              ${className}
            `}
            disabled={disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
            id={inputId}
          />

          {rightIcon && (
            <div className="absolute right-3 top-[50%]  transform -translate-y-1/2 text-neutral-500">
              {rightIcon}
            </div>
          )}
        </div>

        {(helpText || error) && (
          <div
            className={`mt-1.5 text-[12px] leading-tight ${
              error ? "text-status-error" : "text-neutral-500"
            }`}
          >
            {error || helpText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
