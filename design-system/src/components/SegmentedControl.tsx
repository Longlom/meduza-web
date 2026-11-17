'use client';

import { useRef } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { cx } from '../utils';

export interface Option<T extends string> {
  value: T;
  label: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible name for the group, e.g. "Experience" or "Language". */
  label: string;
  /** "tabs" when it switches visible content; "radio" when it picks a form value. */
  role?: 'tabs' | 'radio';
  size?: 'sm' | 'md';
  glass?: boolean;
  className?: string;
}

/** iOS-style segmented control. Arrow keys move the selection (roving tabindex). */
export function SegmentedControl<T extends string>({
  options, value, onChange, label, role = 'radio', size = 'md', glass, className,
}: SegmentedControlProps<T>) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const enabled = options.filter((o) => !o.disabled);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const i = enabled.findIndex((o) => o.value === value);
    const next = enabled[(i + dir + enabled.length) % enabled.length];
    onChange(next.value);
    refs.current[options.indexOf(next)]?.focus();
  };

  const isTabs = role === 'tabs';
  return (
    <div
      role={isTabs ? 'tablist' : 'radiogroup'}
      aria-label={label}
      className={cx('mz-segmented', size === 'sm' && 'mz-segmented--sm', glass && 'mz-segmented--glass', className)}
    >
      {options.map((o, i) => {
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            role={isTabs ? 'tab' : 'radio'}
            aria-selected={isTabs ? selected : undefined}
            aria-checked={isTabs ? undefined : selected}
            tabIndex={selected ? 0 : -1}
            disabled={o.disabled}
            className="mz-segmented__item"
            onClick={() => onChange(o.value)}
            onKeyDown={onKeyDown}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export interface ChipGroupProps<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}

/** Horizontally scrolling filter chips (menu categories). */
export function ChipGroup<T extends string>({ options, value, onChange, label, className }: ChipGroupProps<T>) {
  return (
    <div role="group" aria-label={label} className={cx('mz-chips', className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className="mz-chip"
          aria-pressed={o.value === value}
          disabled={o.disabled}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
