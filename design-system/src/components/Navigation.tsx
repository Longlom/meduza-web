import type { HTMLAttributes, ImgHTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils';
import logoLight from '../../assets/logo-white.png';
import logoDark from '../../assets/logo-ink.png';

export interface LogoProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  /** "light" = white mark for dark grounds (default); "dark" = ink mark for Pearl. */
  tone?: 'light' | 'dark';
  height?: number;
}

/**
 * Meduza wordmark with the jellyfish.
 * NOTE: current files are traced from a menu photo (514 px). Replace assets/logo-*.png with the vector master when available.
 */
export function Logo({ tone = 'light', height = 34, alt = 'Meduza — Cocktails & Cuisine', className, style, ...rest }: LogoProps) {
  return (
    <img
      src={tone === 'light' ? logoLight : logoDark}
      alt={alt}
      className={cx('mz-logo', className)}
      style={{ ['--mz-logo-h' as string]: `${height}px`, ...style }}
      {...rest}
    />
  );
}

export interface NavLink {
  href: string;
  label: ReactNode;
  current?: boolean;
}

export interface NavBarProps extends HTMLAttributes<HTMLElement> {
  brand: ReactNode;
  links?: NavLink[];
  actions?: ReactNode;
  /** Frosted glass for use over hero photography. */
  glass?: boolean;
  label?: string;
}

/** Floating pill navigation. Links collapse below 760 px — pair with TabBar on phones. */
export function NavBar({ brand, links = [], actions, glass = true, label = 'Main', className, ...rest }: NavBarProps) {
  return (
    <nav aria-label={label} className={cx('mz-nav', glass && 'mz-glass', className)} {...rest}>
      <div className="mz-nav__brand">{brand}</div>
      {links.length ? (
        <div className="mz-nav__links">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="mz-nav__link" aria-current={l.current ? 'page' : undefined}>{l.label}</a>
          ))}
        </div>
      ) : null}
      <div className="mz-nav__actions">{actions}</div>
    </nav>
  );
}

export interface TabItem {
  href: string;
  label: string;
  icon: ReactNode;
  current?: boolean;
}

export interface TabBarProps extends HTMLAttributes<HTMLElement> {
  items: TabItem[];
  label?: string;
}

/** Phone tab bar — four items max; keep "Book" one tap away. */
export function TabBar({ items, label = 'Tabs', className, ...rest }: TabBarProps) {
  return (
    <nav aria-label={label} className={cx('mz-tabbar', 'mz-glass', className)} {...rest}>
      {items.map((t) => (
        <a key={t.href} href={t.href} className="mz-tabbar__item" aria-current={t.current ? 'page' : undefined}>
          {t.icon}
          {t.label}
        </a>
      ))}
    </nav>
  );
}
