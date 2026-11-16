import type { SVGProps } from 'react';

/**
 * Meduza line icons — 24px grid, 1.5px stroke, round caps. They inherit `currentColor`.
 * Decorative by default (aria-hidden). Pass `title` to make an icon meaningful to screen readers.
 */
export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  size?: number;
  title?: string;
}

function make(name: string, body: JSX.Element, strokeWidth = 1.5) {
  const Icon = ({ size = 24, title, ...rest }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {body}
    </svg>
  );
  Icon.displayName = `${name}Icon`;
  return Icon;
}

/** The house glyph — also the unit of the cocktail strength meter. */
export const JellyfishIcon = make('Jellyfish', (
  <>
    <path d="M5 11a7 7 0 0 1 14 0v.5H5Z" />
    <path d="M8 11.5v2.5c0 1.6-1.2 2.4-1.2 4.2M12 11.5v7.5M16 11.5v2.5c0 1.6 1.2 2.4 1.2 4.2" />
  </>
), 1.7);

export const CalendarIcon = make('Calendar', (<><rect x="3.5" y="5" width="17" height="15" rx="3" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>));
export const ClockIcon = make('Clock', (<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>));
export const GuestsIcon = make('Guests', (
  <><circle cx="9" cy="8.5" r="3.5" /><path d="M2.5 19.5c.8-3.3 3.4-5 6.5-5s5.7 1.7 6.5 5" /><path d="M15.5 5.2a3.5 3.5 0 0 1 0 6.6M18 14.8c1.8.7 3 2.3 3.5 4.7" /></>
));
export const LocationIcon = make('Location', (<><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.3" /></>));
export const PhoneIcon = make('Phone', (<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z" />));
export const MessageIcon = make('Message', (<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 3.5V17h0A2.5 2.5 0 0 1 4 14.5Z" />));
export const LeafIcon = make('Leaf', (<><path d="M5 19c0-8 5-13 14-14 0 9-5 14-12 14" /><path d="M5 19 13 11" /></>), 1.8);
export const ChiliIcon = make('Chili', (<><path d="M7 9c-1.5 5 1 11 7.5 11.5C19 21 20 17 17.5 13c-2-3-4-4-5-5" /><path d="M7 9c1.5-1.5 4-1.5 5.5-1M10 6.5c0-1.5 1-2.5 2.5-3" /></>), 1.8);
export const HookahIcon = make('Hookah', (
  <><path d="M12 3v3M9.5 6h5M10.5 6v4.5M13.5 6v4.5" /><path d="M8 21c-1.5 0-2.5-1.2-2.2-2.7l1.4-5.6c.3-1.3 1.4-2.2 2.8-2.2h4c1.4 0 2.5.9 2.8 2.2l1.4 5.6c.3 1.5-.7 2.7-2.2 2.7Z" /><path d="M17.5 14c2 0 3 1.2 3 3" /></>
));
export const GlassIcon = make('Cocktail', (<><path d="M5 4h14l-7 8Z" /><path d="M12 12v8M8 20h8" /></>));
export const MenuBookIcon = make('Menu', (<path d="M6 3.5h12v17H6zM9 8h6M9 12h6M9 16h3" />));
export const PlusIcon = make('Plus', (<path d="M12 5v14M5 12h14" />), 2);
export const MinusIcon = make('Minus', (<path d="M5 12h14" />), 2);
export const ChevronRightIcon = make('ChevronRight', (<path d="M9 6l6 6-6 6" />), 2);
export const ChevronLeftIcon = make('ChevronLeft', (<path d="M15 6l-6 6 6 6" />), 2);
export const CheckIcon = make('Check', (<path d="M5 12.5 10 17l9-10" />), 2);
export const CloseIcon = make('Close', (<path d="M6 6l12 12M18 6 6 18" />), 2);
export const GlobeIcon = make('Globe', (<><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5Z" /></>));
