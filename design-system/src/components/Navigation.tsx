import { Fragment } from 'react';
import type { HTMLAttributes, ImgHTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils';
import logoLight from '../../assets/logo-white.png';
import logoDark from '../../assets/logo-ink.png';

/** Vite imports an image as a URL string; Next.js imports it as { src, width, height }. Accept both. */
const assetUrl = (m: string | { src: string }) => (typeof m === 'string' ? m : m.src);

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
      src={assetUrl(tone === 'light' ? logoLight : logoDark)}
      alt={alt}
      className={cx('mz-logo', className)}
      style={{ ['--mz-logo-h' as string]: `${height}px`, ...style }}
      {...rest}
    />
  );
}

/** What a link renderer receives. Lets an app plug in client-side routing (e.g. next/link). */
export interface LinkRenderProps {
  href: string;
  className: string;
  'aria-current'?: 'page';
  children: ReactNode;
}
export type RenderLink = (props: LinkRenderProps) => ReactNode;

const defaultRenderLink: RenderLink = ({ children, ...rest }) => <a {...rest}>{children}</a>;

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
  /** Optional custom link element (default: a plain <a>). */
  renderLink?: RenderLink;
}

/** Floating pill navigation. Links collapse below 760 px — pair with TabBar on phones. */
export function NavBar({ brand, links = [], actions, glass = true, label = 'Main', renderLink = defaultRenderLink, className, ...rest }: NavBarProps) {
  return (
    <nav aria-label={label} className={cx('mz-nav', glass && 'mz-glass', className)} {...rest}>
      <div className="mz-nav__brand">{brand}</div>
      {links.length ? (
        <div className="mz-nav__links">
          {links.map((l) => (
            <Fragment key={l.href}>
              {renderLink({ href: l.href, className: 'mz-nav__link', 'aria-current': l.current ? 'page' : undefined, children: l.label })}
            </Fragment>
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
  /** Optional custom link element (default: a plain <a>). */
  renderLink?: RenderLink;
}

/** Phone tab bar — four items max; keep "Book" one tap away. */
export function TabBar({ items, label = 'Tabs', renderLink = defaultRenderLink, className, ...rest }: TabBarProps) {
  return (
    <nav aria-label={label} className={cx('mz-tabbar', 'mz-glass', className)} {...rest}>
      {items.map((t) => (
        <Fragment key={t.href}>
          {renderLink({
            href: t.href,
            className: 'mz-tabbar__item',
            'aria-current': t.current ? 'page' : undefined,
            children: (<>{t.icon}{t.label}</>)
          })}
        </Fragment>
      ))}
    </nav>
  );
}
