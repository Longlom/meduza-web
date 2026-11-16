import type { HTMLAttributes, ReactNode } from 'react';
import { ChiliIcon, JellyfishIcon, LeafIcon } from '../icons';
import { cx, formatPrice } from '../utils';
import type { Locale } from '../utils';

export type Strength = 1 | 2 | 3;
const strengthWords: Record<Locale, [string, string, string]> = {
  en: ['Light', 'Mild', 'Strong'],
  ru: ['Лёгкий', 'Средний', 'Крепкий'],
  vi: ['Nhẹ', 'Vừa', 'Mạnh'],
};

export interface StrengthMeterProps {
  level: Strength;
  /** Show the word next to the jellyfish. */
  showLabel?: boolean;
  /** Show unlit jellyfish up to 3 (meter style) instead of only lit ones (menu style). */
  showScale?: boolean;
  size?: number;
  locale?: Locale;
  className?: string;
}

/** Cocktail strength in jellyfish — carried over from the printed Meduza menu. */
export function StrengthMeter({ level, showLabel, showScale, size = 16, locale = 'en', className }: StrengthMeterProps) {
  const word = strengthWords[locale][level - 1];
  const count = showScale ? 3 : level;
  return (
    <span className={cx('mz-strength', className)} role="img" aria-label={word}>
      <span className="mz-strength__icons" aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
          <JellyfishIcon key={i} size={size} className={i < level ? undefined : 'mz-strength__off'} />
        ))}
      </span>
      {showLabel ? <span className="mz-strength__label" aria-hidden="true">{word}</span> : null}
    </span>
  );
}

export interface MenuItemData {
  id?: string;
  name: string;
  /** Short description or ingredients: "Vodka · citrus · blue". */
  description?: string;
  /** Name in the second language (Vietnamese on the printed menu). */
  localName?: string;
  /** Price in VND. Omit for items priced at section level (teas). */
  price?: number;
  vegetarian?: boolean;
  spicy?: boolean;
  strength?: Strength;
  badge?: ReactNode;
}

export interface MenuItemProps extends MenuItemData {
  locale?: Locale;
  labels?: { vegetarian?: string; spicy?: string };
  className?: string;
}

/** One dish or drink row: name + markers, price right, description and local name below. */
export function MenuItem({
  name, description, localName, price, vegetarian, spicy, strength, badge, locale = 'en',
  labels = { vegetarian: 'Vegetarian', spicy: 'Spicy' }, className,
}: MenuItemProps) {
  return (
    <div className={cx('mz-menu-item', className)}>
      <div className="mz-menu-item__title">
        <span>{name}</span>
        {vegetarian ? <LeafIcon size={16} title={labels.vegetarian} style={{ color: 'var(--mz-success)' }} /> : null}
        {spicy ? <ChiliIcon size={16} title={labels.spicy} style={{ color: 'var(--mz-danger)' }} /> : null}
        {strength ? <StrengthMeter level={strength} size={15} locale={locale} /> : null}
        {badge}
      </div>
      <span className="mz-menu-item__price">{price != null ? formatPrice(price, locale) : null}</span>
      {description ? <span className="mz-menu-item__desc">{description}</span> : null}
      {localName ? <span className="mz-menu-item__local" lang="vi">{localName}</span> : null}
    </div>
  );
}

export interface MenuSectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  subtitle?: ReactNode;
  note?: ReactNode;
  headingLevel?: 2 | 3;
  children: ReactNode;
}

/** A card-like menu section ("Cold Starters · Khai vị lạnh"). */
export function MenuSection({ title, subtitle, note, headingLevel = 2, className, children, ...rest }: MenuSectionProps) {
  const H = (headingLevel === 2 ? 'h2' : 'h3') as 'h2' | 'h3';
  return (
    <section className={cx('mz-menu-section', className)} {...rest}>
      <div className="mz-menu-section__head">
        <div>
          <H className="mz-title-3" style={{ fontSize: 28 }}>{title}</H>
          {subtitle ? <span className="mz-callout mz-secondary" lang="vi">{subtitle}</span> : null}
        </div>
        {note ? <span className="mz-menu-section__note">{note}</span> : null}
      </div>
      {children}
    </section>
  );
}

export interface PriceTableRow {
  name: string;
  /** VND per column; null/undefined renders an em dash. */
  prices: Array<number | null | undefined>;
}

export interface PriceTableProps {
  /** e.g. ["Shot 45 ml", "Bottle 700 ml"] or ["Glass 150 ml", "Bottle"]. */
  columns: string[];
  rows: PriceTableRow[];
  caption?: string;
  locale?: Locale;
  className?: string;
}

/** Spirits and wine: a real table so prices line up and read correctly aloud. */
export function PriceTable({ columns, rows, caption, locale = 'en', className }: PriceTableProps) {
  return (
    <table className={cx('mz-price-table', className)}>
      {caption ? <caption className="mz-visually-hidden">{caption}</caption> : null}
      <thead>
        <tr>
          <th scope="col"><span className="mz-visually-hidden">Item</span></th>
          {columns.map((c) => <th key={c} scope="col">{c}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.name}>
            <td>{r.name}</td>
            {columns.map((c, i) => {
              const p = r.prices[i];
              return (
                <td key={c}>
                  {p != null ? formatPrice(p, locale) : <span className="mz-price-table__empty" aria-label="not available">—</span>}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
