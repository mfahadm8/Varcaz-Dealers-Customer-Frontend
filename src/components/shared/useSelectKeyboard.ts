import { useLayoutEffect, useId, useRef, type KeyboardEvent, type RefObject } from 'react';

interface SelectKeyboardOptions {
  isOpen: boolean;
  disabled?: boolean;
  searchable: boolean;
  multiple: boolean;
  value: string | string[];
  filteredOptions: { value: string; label: string }[];
  triggerRef: RefObject<HTMLDivElement | null>;
  menuRef: RefObject<HTMLDivElement | null>;
  setIsOpen: (open: boolean) => void;
  onSelect: (value: string) => void;
}

export function useSelectKeyboard({ isOpen, disabled, searchable, multiple, value,
  filteredOptions, triggerRef, menuRef, setIsOpen, onSelect }: SelectKeyboardOptions) {
  const listId = useId();
  const focusedOnOpen = useRef(false);
  useLayoutEffect(() => {
    if (!isOpen) { focusedOnOpen.current = false; return; }
    if (searchable || focusedOnOpen.current) return;
    const options = menuRef.current?.querySelectorAll<HTMLElement>('[role="option"]');
    if (!options?.length) return;
    focusedOnOpen.current = true;
    const selected = Array.isArray(value) ? value[0] : value;
    const index = filteredOptions.findIndex(option => option.value === selected);
    options[Math.max(0, index)]?.focus();
  });

  const close = () => { setIsOpen(false); triggerRef.current?.focus(); };
  const onTriggerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled || event.target !== event.currentTarget) return;
    if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault(); event.stopPropagation(); setIsOpen(true);
    } else if (event.key === 'Escape' && isOpen) {
      event.preventDefault(); event.stopPropagation(); close();
    }
  };
  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault(); event.stopPropagation(); close(); return;
    }
    const options = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);
    const index = options.indexOf(event.target as HTMLElement);
    const input = event.target instanceof HTMLInputElement;
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key) && !(input && ['Home', 'End'].includes(event.key))) {
      event.preventDefault(); event.stopPropagation();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1
        : event.key === 'ArrowDown' ? (index + 1) % options.length
          : (index < 0 ? options.length - 1 : (index - 1 + options.length) % options.length);
      options[next]?.focus();
    } else if ((event.key === 'Enter' || (event.key === ' ' && !input)) && filteredOptions.length) {
      event.preventDefault(); event.stopPropagation();
      onSelect(filteredOptions[Math.max(0, index)].value);
      if (!multiple) triggerRef.current?.focus();
    } else if (event.key === 'Tab') {
      // Return to the trigger before normal tab traversal, including portal menus.
      close();
    }
  };
  return { listId, onTriggerKeyDown, onMenuKeyDown };
}

