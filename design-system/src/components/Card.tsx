import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  raised?: boolean;
  /** No padding, clips children — for cards with edge-to-edge media. */
  flush?: boolean;
}

export function Card({ raised, flush, className, ...rest }: CardProps) {
  return <div className={cx('mz-card', raised && 'mz-card--raised', flush && 'mz-card--flush', className)} {...rest} />;
}

/** Frosted surface: Abyss Glass on dark, Pearl Glass on light. Put it over photography. */
export function Glass({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('mz-glass', className)} {...rest} />;
}

export interface MediaCardProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'title'> {
  image: string;
  /** Describe the photo; pass "" if the text already says everything. */
  imageAlt: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  text?: ReactNode;
  /** Card height; defaults to 520px. */
  height?: number | string;
  /** Use the Lantern accent for the eyebrow regardless of page mood. */
  mood?: 'glow' | 'lantern';
}

/** Full-bleed photo card with a scrim and text at the bottom — the "Brunch / Dining / Lounge" tiles. */
export function MediaCard({ image, imageAlt, eyebrow, title, text, height, mood, className, style, ...rest }: MediaCardProps) {
  return (
    <a
      className={cx('mz-media-card', className)}
      data-mood={mood === 'lantern' ? 'lantern' : undefined}
      style={{ ...(height != null ? { ['--mz-media-card-h' as string]: typeof height === 'number' ? `${height}px` : height } : null), ...style }}
      {...rest}
    >
      <img className="mz-media-card__img" src={image} alt={imageAlt} loading="lazy" />
      <div className="mz-media-card__body">
        {eyebrow ? <span className="mz-eyebrow">{eyebrow}</span> : null}
        <span className="mz-media-card__title">{title}</span>
        {text ? <span className="mz-media-card__text">{text}</span> : null}
      </div>
    </a>
  );
}
