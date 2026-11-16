import { forwardRef } from 'react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils';

export type ButtonVariant = 'primary' | 'secondary' | 'inverse' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Soft halo in the accent colour — reserve for the one hero action per screen. */
  glow?: boolean;
  block?: boolean;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  children?: ReactNode;
}

export type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
export type LinkButtonProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

const classes = ({ variant = 'primary', size = 'md', glow, block }: CommonProps, extra?: string) =>
  cx('mz-btn', `mz-btn--${variant}`, size !== 'md' && `mz-btn--${size}`, glow && 'mz-btn--glow', block && 'mz-btn--block', extra);

/**
 * Pill button. Renders an <a> when `href` is given, otherwise a <button type="button">.
 * Rule: one filled (primary or inverse) button per view.
 */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps | LinkButtonProps>(
  function Button(props, ref) {
    const { variant, size, glow, block, iconStart, iconEnd, children, className, ...rest } = props;
    const cls = classes({ variant, size, glow, block }, className);
    const content = (<>{iconStart}{children}{iconEnd}</>);
    if (typeof (rest as LinkButtonProps).href === 'string') {
      return <a ref={ref as React.Ref<HTMLAnchorElement>} className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>{content}</a>;
    }
    const btn = rest as ButtonHTMLAttributes<HTMLButtonElement>;
    return <button ref={ref as React.Ref<HTMLButtonElement>} type={btn.type ?? 'button'} className={cls} {...btn}>{content}</button>;
  },
);

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required: icon-only buttons need an accessible name. */
  'aria-label': string;
  solid?: boolean;
  children: ReactNode;
}

/** 44×44 round icon button. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { solid, className, children, type = 'button', ...rest }, ref,
) {
  return (
    <button ref={ref} type={type} className={cx('mz-icon-btn', solid && 'mz-icon-btn--solid', className)} {...rest}>
      {children}
    </button>
  );
});
