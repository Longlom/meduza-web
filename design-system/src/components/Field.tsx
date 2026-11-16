import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import { cx } from '../utils';

interface FieldChrome {
  label: ReactNode;
  hint?: ReactNode;
  /** When set, the control is marked invalid and the message is linked via aria-describedby. */
  error?: ReactNode;
  optional?: boolean;
  optionalText?: string;
}

function Chrome({ id, label, hint, error, optional, optionalText = 'optional', children }: FieldChrome & { id: string; children: ReactNode }) {
  return (
    <div className="mz-field">
      <label htmlFor={id} className="mz-field__label">
        {label}{optional ? ` · ${optionalText}` : null}
      </label>
      {children}
      {error ? <span id={`${id}-error`} className="mz-field__error">{error}</span>
        : hint ? <span id={`${id}-hint`} className="mz-field__hint">{hint}</span> : null}
    </div>
  );
}

export type TextFieldProps = FieldChrome & InputHTMLAttributes<HTMLInputElement>;

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, hint, error, optional, optionalText, id, className, ...rest }, ref,
) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <Chrome id={fid} label={label} hint={hint} error={error} optional={optional} optionalText={optionalText}>
      <input
        ref={ref}
        id={fid}
        className={cx('mz-field__control', className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fid}-error` : hint ? `${fid}-hint` : undefined}
        required={!optional}
        {...rest}
      />
    </Chrome>
  );
});

export type TextAreaProps = FieldChrome & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, hint, error, optional, optionalText, id, className, rows = 3, ...rest }, ref,
) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <Chrome id={fid} label={label} hint={hint} error={error} optional={optional} optionalText={optionalText}>
      <textarea
        ref={ref}
        id={fid}
        rows={rows}
        className={cx('mz-field__control', className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fid}-error` : hint ? `${fid}-hint` : undefined}
        {...rest}
      />
    </Chrome>
  );
});
