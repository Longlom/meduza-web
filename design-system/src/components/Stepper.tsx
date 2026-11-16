import { useId } from 'react';
import { IconButton } from './Button';
import { MinusIcon, PlusIcon } from '../icons';
import { cx } from '../utils';

export interface StepperProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  /** Screen-reader names for the buttons. */
  decrementLabel?: string;
  incrementLabel?: string;
  /** Optional text shown instead of the number, e.g. "12+" for private events. */
  format?: (value: number) => string;
  className?: string;
}

/** Guest counter: big tabular number, round − / + buttons. Announces changes politely. */
export function Stepper({
  label, value, onChange, min = 1, max = 12,
  decrementLabel = `Fewer ${label.toLowerCase()}`, incrementLabel = `More ${label.toLowerCase()}`,
  format = String, className,
}: StepperProps) {
  const id = useId();
  return (
    <div className={cx('mz-stepper', className)} role="group" aria-labelledby={id}>
      <div>
        <span id={id} className="mz-stepper__label">{label}</span>
        <span className="mz-stepper__value" aria-live="polite">{format(value)}</span>
      </div>
      <div className="mz-stepper__controls">
        <IconButton aria-label={decrementLabel} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}>
          <MinusIcon size={20} />
        </IconButton>
        <IconButton aria-label={incrementLabel} solid onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}>
          <PlusIcon size={20} />
        </IconButton>
      </div>
    </div>
  );
}
