import { useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react';

import { mediaPanel } from '@/features/media/components/media-ui.variants';
import { cn } from '@/lib/cn';

type ModalShellProps = {
  open: boolean;
  titleId: string;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  className?: string;
};

/**
 * Accessible modal shell with focus trap, escape close, and focus restore.
 */
export function ModalShell({ open, titleId, onOpenChange, children, className }: ModalShellProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const previousFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previousFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const container = containerRef.current;
    if (!container) return;

    const first = getFocusable(container)[0];
    (first ?? container).focus();

    return () => {
      previousFocusedRef.current?.focus();
    };
  }, [open]);

  if (!open) return null;

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onOpenChange(false);
      return;
    }

    if (event.key !== 'Tab') return;

    const container = containerRef.current;
    if (!container) return;

    const focusable = getFocusable(container);
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="presentation">
      <section
        aria-labelledby={titleId}
        aria-modal="true"
        className={cn(mediaPanel(), 'w-full max-w-md p-4 shadow-lg outline-none', className)}
        onKeyDown={onKeyDown}
        ref={containerRef}
        role="dialog"
        tabIndex={-1}
      >
        {children}
      </section>
    </div>
  );
}

function getFocusable(container: HTMLElement): HTMLElement[] {
  const selector = [
    'button:not([disabled])',
    'a[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement
  );
}
