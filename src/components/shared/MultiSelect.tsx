import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, X } from "lucide-react";
import Input from "./Input";
import { useSelectKeyboard } from "./useSelectKeyboard";

export interface SelectOption {
  value: string;
  label: string;
  marker?: React.ReactNode;
}

interface SelectProps {
  id?: string;
  name?: string;
  options: SelectOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  label?: string;
  helpText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  fullWidth?: boolean;
  containerClassName?: string;
  className?: string;
  searchable?: boolean;
  noWrap?: boolean;
  portal?: boolean;
  triggerContent?: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({
  id,
  name,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  helpText,
  error,
  required,
  disabled,
  multiple = false,
  fullWidth = true,
  containerClassName = "",
  className = "",
  searchable = false,
  noWrap = false,
  portal = false,
  triggerContent,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  // Filter options based on search query
  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchValue.toLowerCase())
      )
    : options;

  const handleToggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen && searchable) {
        // Focus the search input when opening
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 10);
      }
    }
  };

  const handleSelectOption = (optionValue: string) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue];
      onChange(newValues);
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }

    if (searchable) {
      setSearchValue("");
    }
  };

  const handleRemoveOption = (optionToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple && Array.isArray(value)) {
      const newValues = value.filter((v) => v !== optionToRemove);
      onChange(newValues);
    }
  };

  // Get selected option labels for display - properly typed
  const getSelectedLabels = (): { label: string; value: string }[] => {
    if (multiple && Array.isArray(value)) {
      return value.map((v) => {
        const option = options.find((o) => o.value === v);
        return {
          label: option ? option.label : v,
          value: v,
        };
      });
    } else if (!multiple && typeof value === "string" && value) {
      const option = options.find((o) => o.value === value);
      return option ? [{ label: option.label, value }] : [];
    }
    return [];
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !menuRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useLayoutEffect(() => {
    if (!isOpen || !portal) {
      setMenuPosition(null);
      return;
    }

    const updateMenuPosition = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      const viewportGutter = 16;
      const width = Math.min(300, Math.max(180, rect.width));
      const left = Math.min(
        Math.max(viewportGutter, rect.right - width),
        window.innerWidth - width - viewportGutter,
      );
      setMenuPosition({
        top: rect.bottom + 4,
        left,
        width,
      });
    };

    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);
    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [isOpen, portal]);

  // Get a simple display value for single select
  const getSingleSelectDisplayValue = (): string => {
    if (!multiple && typeof value === "string" && value) {
      const option = options.find((o) => o.value === value);
      return option ? option.label : "";
    }
    return "";
  };

  const keyboard = useSelectKeyboard({
    isOpen, disabled, searchable, multiple, value, filteredOptions,
    triggerRef, menuRef, setIsOpen, onSelect: handleSelectOption,
  });
  const selectedLabels = getSelectedLabels();
  const dropdownMenu = isOpen && (!portal || menuPosition) ? (
    <div
      ref={menuRef}
      onKeyDown={keyboard.onMenuKeyDown}
      className={`${
        portal
          ? "fixed"
          : "absolute right-0 mt-1 min-w-full w-max max-w-[300px]"
      } z-[9999999] max-h-60 overflow-auto rounded-md border border-neutral-150 bg-white shadow-md animate-slideIn`}
      style={portal && menuPosition ? menuPosition : undefined}
    >
      {searchable && (
        <div className="sticky top-0 border-b border-neutral-150 bg-white p-2">
          <Input
            ref={searchInputRef}
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search..."
            className="h-10 w-full px-3 py-2"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {filteredOptions.length > 0 ? (
        <ul id={keyboard.listId} role="listbox" aria-label={label || name || placeholder} aria-multiselectable={multiple}>
          {filteredOptions.map((option) => {
            const isSelected = multiple
              ? Array.isArray(value) && value.includes(option.value)
              : value === option.value;

            return (
              <li
                key={option.value}
                className={`
                  px-4 py-2 cursor-pointer flex items-center body-sm
                  ${
                    isSelected
                      ? "bg-status-green-10 !text-neutral-900"
                      : "text-neutral-800"
                  }
                  ${isSelected ? "font-medium" : ""}
                  hover:bg-neutral-50 transition-colors duration-100
                `}
                onClick={() => handleSelectOption(option.value)}
                tabIndex={-1}
                role="option"
                aria-selected={isSelected}
              >
                {multiple && (
                  <div
                    className={`
                    w-5 h-5 mr-2 rounded flex items-center justify-center
                    border ${
                      isSelected
                        ? "border-secondary-500 bg-secondary-500"
                        : "border-neutral-300"
                    }
                  `}
                  >
                    {isSelected && <Check size={12} className="text-white" />}
                  </div>
                )}
                {option.marker && <span className="mr-2 inline-flex shrink-0">{option.marker}</span>}
                <span className="truncate">{option.label}</span>
                {!multiple && isSelected && (
                  <Check size={16} className="ml-auto text-secondary-500" />
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="p-4 text-center text-neutral-500">No options found</div>
      )}
    </div>
  ) : null;

  return (
    <div className={`${fullWidth ? "w-full" : ""} ${containerClassName}`}>
      {label && (
        <label
          htmlFor={id || name}
          className="block font-medium text-neutral-800 mb-1.5"
        >
          {label} {required && <span className="text-status-error">*</span>}
        </label>
      )}

      <div className="relative" ref={dropdownRef}>
        {/* Select Display */}
        <div
          ref={triggerRef}
          className={`
       w-full px-4 py-3 bg-white
            border   ${
              error
                ? "border-status-error"
                : isOpen
                ? "border-secondary-500"
                : "border-neutral-100"
            }
            rounded-md text-neutral-800 text-[14px]
            transition-colors duration-200
            outline-none cursor-pointer
            flex items-center justify-between
           
            ${
              disabled
                ? "bg-neutral-50 text-neutral-500 cursor-not-allowed"
                : ""
            }
            ${className}
          `}
          id={id}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={keyboard.onTriggerKeyDown}
          onClick={handleToggleDropdown}
          role="button"
          aria-controls={isOpen ? keyboard.listId : undefined}
          aria-label={label || name || placeholder}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-disabled={disabled}
        >
          <div className={`flex min-w-0 flex-1 ${noWrap ? "overflow-hidden" : ""}`}>
            {multiple && Array.isArray(value) && value.length > 0 ? (
              <div
                className={`flex gap-1  ${
                  noWrap
                    ? "overflow-x-auto whitespace-nowrap scrollbar-hide"
                    : "flex-wrap"
                }`}
              >
                {selectedLabels.map((item, index) => (
                  <div
                    key={index}
                    className={`inline-flex items-center bg-neutral-100 text-neutral-800 text-xs px-2 py-1 rounded ${
                      noWrap ? "shrink-0" : ""
                    }`}
                  >
                    {item.label}
                    <X
                      size={14}
                      className="ml-1 cursor-pointer"
                      onClick={(e) => handleRemoveOption(item.value, e)}
                    />
                  </div>
                ))}
              </div>
            ) : !multiple && typeof value === "string" && value ? (
              <div className="truncate">{triggerContent ?? getSingleSelectDisplayValue()}</div>
            ) : (
              <div className=" whitespace-nowrap font-regular text-neutral-900 hover:bg-neutral-100 opacity-80">
                {placeholder}
              </div>
            )}
          </div>
          <ChevronDown
            size={18}
            className={`ml-2 shrink-0 transition-transform  text-neutral-500 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {portal && dropdownMenu && typeof document !== "undefined"
          ? createPortal(dropdownMenu, document.body)
          : dropdownMenu}
      </div>

      {(helpText || error) && (
        <div
          className={`mt-1.5 text-[12px] ${
            error ? "text-status-error" : "text-neutral-500"
          }`}
        >
          {error || helpText}
        </div>
      )}
    </div>
  );
};

export default Select;
