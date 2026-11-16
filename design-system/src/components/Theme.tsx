import type { HTMLAttributes } from 'react';
import type { Mood, ThemeName } from '../tokens';

export interface ThemeProps extends HTMLAttributes<HTMLDivElement> {
  theme?: ThemeName;
  mood?: Mood;
}

/**
 * Scopes a theme and/or mood to a subtree:
 *   <Theme theme="pearl" mood="lantern">…brunch section…</Theme>
 * For the whole page, set the attributes on <html> instead: <html data-theme="abyss">.
 */
export function Theme({ theme, mood, style, ...rest }: ThemeProps) {
  return (
    <div
      data-theme={theme}
      data-mood={mood === 'lantern' ? 'lantern' : undefined}
      style={theme ? { background: 'var(--mz-bg)', color: 'var(--mz-text)', ...style } : style}
      {...rest}
    />
  );
}
