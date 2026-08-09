/**
 * Terminal.tsx
 * Floating, draggable terminal window component.
 * Renders the full shell UI: title bar, output pane, prompt input.
 */

import React, { useRef, useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UseTerminalReturn } from '../hooks/useTerminal.ts';
import { LineType } from '../commands/commandEngine.ts';

interface TerminalProps {
  terminal: UseTerminalReturn;
  onNavigate: (section: string) => void;
  onTheme: (t: 'dark' | 'light') => void;
}

// ── Color map for each line type ──────────────────────────────────────────
const LINE_COLORS: Record<LineType, string> = {
  output:  'text-[#cdd9e5]',
  info:    'text-[var(--brand-cyan)]',
  success: 'text-[#3fb950]',
  error:   'text-[#f85149]',
  warn:    'text-[#d29922]',
  prompt:  'text-[#cdd9e5]',
  dim:     'text-[#6e7681]',
  accent:  'text-[var(--accent)] font-semibold',
};

// ── Draggable hook ────────────────────────────────────────────────────────
function useDrag(initialPos: { x: number; y: number }) {
  const [pos, setPos] = useState(initialPos);
  const dragging = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startPos   = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true;
    startMouse.current = { x: e.clientX, y: e.clientY };
    startPos.current   = pos;
    e.preventDefault();
  }, [pos]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      setPos({
        x: startPos.current.x + (e.clientX - startMouse.current.x),
        y: startPos.current.y + (e.clientY - startMouse.current.y),
      });
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
    };
  }, []);

  return { pos, onMouseDown };
}

// ── Terminal Window ────────────────────────────────────────────────────────
export const Terminal: React.FC<TerminalProps> = ({ terminal, onNavigate, onTheme }) => {
  const { isOpen, closeTerminal, lines, inputValue, setInputValue,
          handleSubmit, handleKeyDown, inputRef, outputRef } = terminal;

  const callbacks = { onNavigate, onTheme };

  // Start roughly centered, nudged slightly up-left
  const { pos, onMouseDown } = useDrag({
    x: Math.max(0, (window.innerWidth  - 740) / 2),
    y: Math.max(0, (window.innerHeight - 520) / 2 - 40),
  });

  // Click-outside to close (only on backdrop, not the window itself)
  const windowRef = useRef<HTMLDivElement>(null);
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (windowRef.current && !windowRef.current.contains(e.target as Node)) {
      closeTerminal();
    }
  }, [closeTerminal]);

  // Esc to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) closeTerminal();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, closeTerminal]);

  return (
    <AnimatePresence>
      {isOpen && (
        /* Backdrop */
        <motion.div
          className="fixed inset-0 z-[9000] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={handleBackdropClick}
          style={{ pointerEvents: 'auto' }}
        >
          {/* Terminal Window */}
          <motion.div
            ref={windowRef}
            className="terminal-window pointer-events-auto"
            style={{ position: 'fixed', left: pos.x, top: pos.y, width: 'min(740px, 96vw)' }}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            onClick={e => e.stopPropagation()}
          >
            {/* ── Title bar ── */}
            <div
              className="terminal-titlebar"
              onMouseDown={onMouseDown}
              style={{ cursor: 'grab' }}
            >
              {/* Traffic lights */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={closeTerminal}
                  className="terminal-dot terminal-dot-red group"
                  aria-label="Close terminal"
                >
                  <span className="terminal-dot-icon opacity-0 group-hover:opacity-100">✕</span>
                </button>
                <div className="terminal-dot terminal-dot-yellow" aria-hidden />
                <div className="terminal-dot terminal-dot-green"  aria-hidden />
              </div>

              {/* Session label */}
              <div className="terminal-session-label">
                <span className="terminal-prompt-host">guuleed</span>
                <span className="text-[#6e7681]">@</span>
                <span className="terminal-prompt-dir">portfolio</span>
                <span className="text-[#6e7681]">: — bash</span>
              </div>

              <div className="w-14" aria-hidden /> {/* spacer for symmetry */}
            </div>

            {/* ── Scanline overlay ── */}
            <div className="terminal-scanlines" aria-hidden />

            {/* ── Output pane ── */}
            <div
              ref={outputRef}
              className="terminal-output"
              aria-live="polite"
              aria-label="Terminal output"
            >
              {lines.map(l => (
                <div
                  key={l.id}
                  className={`terminal-line ${LINE_COLORS[l.type]}`}
                >
                  {l.type === 'prompt' && (
                    <span className="terminal-inline-prompt" aria-hidden>
                      <span className="terminal-prompt-host">guuleed</span>
                      <span className="text-[#6e7681]">@</span>
                      <span className="terminal-prompt-dir">portfolio</span>
                      <span className="terminal-prompt-symbol">:~$</span>
                      {' '}
                    </span>
                  )}
                  <span style={{ whiteSpace: 'pre-wrap' }}>{l.text}</span>
                </div>
              ))}
            </div>

            {/* ── Input row ── */}
            <div className="terminal-input-row">
              <span className="terminal-prompt-host" aria-hidden>guuleed</span>
              <span className="text-[#6e7681]" aria-hidden>@</span>
              <span className="terminal-prompt-dir" aria-hidden>portfolio</span>
              <span className="terminal-prompt-symbol" aria-hidden>:~$</span>

              <input
                ref={inputRef}
                id="terminal-input"
                type="text"
                value={inputValue}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-label="Terminal input"
                className="terminal-input"
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => handleKeyDown(e, callbacks)}
                placeholder="type a command…"
              />
            </div>

            {/* ── Status bar ── */}
            <div className="terminal-statusbar">
              <span>● CONNECTED</span>
              <span>portfolio-shell v2.0</span>
              <span>↑↓ history · Tab autocomplete · Ctrl+Alt+G toggle</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
