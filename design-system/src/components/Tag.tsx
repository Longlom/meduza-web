import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils';

export type TagTone = 'accent' | 'secondary' | 'success' | 'danger' | 'neutral' | 'glass';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: TagTone;
  size?: 'sm' | 'md';
  icon?: ReactNode;
}

/** Small pill label: "Signature", "Chef's pick", "Vegetarian". Not interactive. */
export function Tag({ tone = 'neutral', size = 'md', icon, className, children, ...rest }: TagProps) {
  return (
    <span className={cx('mz-tag', `mz-tag--${tone}`, size === 'sm' && 'mz-tag--sm', className)} {...rest}>
      {icon}
      {children}
    </span>
  );
}

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  open: boolean;
  children: ReactNode;
}

/** Live "Open now · until 02:00" badge with a slow pulse (disabled under reduced motion). */
export function StatusBadge({ open, children, className, ...rest }: StatusBadgeProps) {
  return (
    <span className={cx('mz-tag', open ? 'mz-tag--success' : 'mz-tag--neutral', className)} role="status" {...rest}>
      <span className="mz-status-dot" aria-hidden="true" />
      {children}
    </span>
  );
}
