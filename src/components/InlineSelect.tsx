"use client";

import * as stylex from "@stylexjs/stylex";
import { styles } from "@/styles/site.stylex";

import * as React from "react";

/** Select a typed option from the inline listbox and close on outside clicks. */
export function InlineSelect<T extends string | number>({
  label,
  value,
  options,
  onChange,
  className,
  menuClassName,
  disabled = false,
}: {
  label?: string;
  value: T;
  options: { label: string; value: T }[];
  onChange: (v: T) => void;
  className?: string;
  menuClassName?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      // SAFETY: this listener is bound to `document`, and a DOM `click` dispatched there always
      // carries the clicked element as its target, so `e.target` is a `Node`.
      const target = e.target as Node;
      if (!ref.current.contains(target)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div
      ref={ref}
      className={[stylex.props(styles.selectWrapper).className, className]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        {...stylex.props(disabled ? styles.selectDisabled : styles.selectEnabled)}
        onClick={(e) => {
          e.preventDefault();
          if (!disabled) setOpen((o) => !o);
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
      >
        {label ? `${label}: ` : null}
        <span {...stylex.props(styles.selectValue)}>{selected?.label ?? String(value)}</span>
      </button>
      {open && !disabled ? (
        <div
          role="listbox"
          className={[stylex.props(styles.selectMenu).className, menuClassName]
            .filter(Boolean)
            .join(" ")}
        >
          {options.map((opt) => (
            <button
              key={String(opt.value)}
              role="option"
              aria-selected={opt.value === value}
              {...stylex.props(opt.value === value ? styles.selectSelected : styles.selectOption)}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
