'use client';

import { useEffect, useRef, useState } from 'react';
import type { PointerEvent, ReactNode } from 'react';
import { IconButton } from './Button';
import { CloseIcon } from '../icons';

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name of the dialog. */
  label: string;
  title?: ReactNode;
  /** Small text on the right of the title, e.g. "14 pages". */
  meta?: ReactNode;
  closeLabel?: string;
  children: ReactNode;
}

/**
 * Bottom sheet for "sheets, not new pages". Built on a native <dialog>, so it traps focus, closes
 * on Escape and returns focus to the button that opened it. On a phone it snaps at 55% and 92% of
 * the screen height and closes by dragging down or tapping outside; from 900 px it is a side panel.
 */
export function BottomSheet({ open, onClose, label, title, meta, closeLabel = 'Close', children }: BottomSheetProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [snap, setSnap] = useState<'half' | 'full'>('half');
  const [drag, setDrag] = useState(0);
  const start = useRef<number | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setSnap('half');
      setDrag(0);
      dialog.showModal();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const down = (e: PointerEvent<HTMLDivElement>) => {
    start.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (start.current !== null) setDrag(e.clientY - start.current);
  };
  const up = (e: PointerEvent<HTMLDivElement>) => {
    if (start.current === null) return;
    const dy = e.clientY - start.current;
    start.current = null;
    setDrag(0);
    if (dy < -60) setSnap('full');
    else if (dy > 90) {
      if (snap === 'full') setSnap('half');
      else onClose();
    }
  };

  return (
    <dialog
      ref={ref}
      className="mz-sheet"
      aria-label={label}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClose={() => {
        if (open) onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="mz-sheet__panel"
        data-snap={snap}
        style={drag > 0 ? { transform: `translateY(${drag}px)`, transition: 'none' } : undefined}
      >
        <div className="mz-sheet__grab" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} aria-hidden="true">
          <span />
        </div>
        {open ? (
          <>
            <div className="mz-sheet__head">
              <h2 className="mz-sheet__title">{title}</h2>
              {meta ? <span className="mz-sheet__meta">{meta}</span> : null}
              <IconButton aria-label={closeLabel} onClick={onClose} className="mz-sheet__close">
                <CloseIcon size={18} />
              </IconButton>
            </div>
            <div className="mz-sheet__body">{children}</div>
          </>
        ) : null}
      </div>
    </dialog>
  );
}
