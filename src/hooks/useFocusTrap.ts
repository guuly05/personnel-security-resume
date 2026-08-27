import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE = [
  'a[href]', 'button:not([disabled])', 'textarea:not([disabled])', 'input:not([disabled])',
  'select:not([disabled])', '[tabindex]:not([tabindex="-1"])',
].join(',');

export function useFocusTrap<T extends HTMLElement>(active: boolean, containerRef: RefObject<T | null>, onEscape: () => void) {
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;
    restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const container = containerRef.current;

    const focusFirst = () => {
      const focusable = container.querySelector<HTMLElement>(FOCUSABLE);
      (focusable ?? container).focus();
    };
    const frame = window.requestAnimationFrame(focusFirst);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onEscape();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!focusable.length) {
        event.preventDefault();
        container.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKeyDown);
      restoreFocusRef.current?.focus();
      restoreFocusRef.current = null;
    };
  }, [active, containerRef, onEscape]);
}
