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

type WindowRect = { x: number; y: number; width: number; height: number };

const MIN_WIDTH = 420;
const MIN_HEIGHT = 320;
const MAX_WIDTH = 1100;
const MAX_HEIGHT = 820;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getInitialRect(): WindowRect {
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 900;
  const width = Math.min(860, viewportWidth - 24);
  const height = Math.min(560, viewportHeight - 120);
  return {
    x: Math.max(12, Math.round((viewportWidth - width) / 2)),
    y: Math.max(12, Math.round((viewportHeight - height) / 2 - 28)),
    width,
    height,
  };
}

// ── Window movement and resizing ───────────────────────────────────────────
function useWindowControls() {
  const [rect, setRect] = useState<WindowRect>(() => getInitialRect());
  const dragState = useRef<
    | { mode: 'drag'; pointerId: number; startX: number; startY: number; startRect: WindowRect }
    | { mode: 'resize'; pointerId: number; startX: number; startY: number; startRect: WindowRect }
    | null
  >(null);

  const syncToViewport = useCallback((nextRect: WindowRect) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const maxWidth = Math.min(MAX_WIDTH, viewportWidth - 16);
    const maxHeight = Math.min(MAX_HEIGHT, viewportHeight - 16);
    const width = clamp(nextRect.width, MIN_WIDTH, maxWidth);
    const height = clamp(nextRect.height, MIN_HEIGHT, maxHeight);
    const x = clamp(nextRect.x, 8, Math.max(8, viewportWidth - width - 8));
    const y = clamp(nextRect.y, 8, Math.max(8, viewportHeight - height - 8));
    return { x, y, width, height };
  }, []);

  const beginDrag = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    if (!(e.currentTarget instanceof HTMLElement)) return;
    dragState.current = {
      mode: 'drag',
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startRect: rect,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  }, [rect]);

  const beginResize = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    if (!(e.currentTarget instanceof HTMLElement)) return;
    dragState.current = {
      mode: 'resize',
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startRect: rect,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
    e.stopPropagation();
  }, [rect]);

  const onPointerMove = useCallback((e: PointerEvent) => {
    const state = dragState.current;
    if (!state || state.pointerId !== e.pointerId) return;

    if (state.mode === 'drag') {
      setRect(syncToViewport({
        ...state.startRect,
        x: state.startRect.x + (e.clientX - state.startX),
        y: state.startRect.y + (e.clientY - state.startY),
      }));
      return;
    }

    const nextWidth = state.startRect.width + (e.clientX - state.startX);
    const nextHeight = state.startRect.height + (e.clientY - state.startY);
    const width = clamp(nextWidth, MIN_WIDTH, Math.min(MAX_WIDTH, window.innerWidth - state.startRect.x - 8));
    const height = clamp(nextHeight, MIN_HEIGHT, Math.min(MAX_HEIGHT, window.innerHeight - state.startRect.y - 8));
    setRect(syncToViewport({ ...state.startRect, width, height }));
  }, [syncToViewport]);

  const endPointer = useCallback((e: PointerEvent) => {
    const state = dragState.current;
    if (!state || state.pointerId !== e.pointerId) return;
    dragState.current = null;
  }, []);

  const handleViewportResize = useCallback(() => {
    setRect(prev => syncToViewport(prev));
  }, [syncToViewport]);

  useEffect(() => {
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', endPointer);
    window.addEventListener('pointercancel', endPointer);
    window.addEventListener('resize', handleViewportResize);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', endPointer);
      window.removeEventListener('pointercancel', endPointer);
      window.removeEventListener('resize', handleViewportResize);
    };
  }, [endPointer, handleViewportResize, onPointerMove, syncToViewport]);

  return { rect, beginDrag, beginResize };
}

// ── Terminal Window ────────────────────────────────────────────────────────
export const Terminal: React.FC<TerminalProps> = ({ terminal, onNavigate, onTheme }) => {
  const { isOpen, closeTerminal, lines, inputValue, setInputValue,
          handleSubmit, handleKeyDown, inputRef, outputRef } = terminal;

  const callbacks = { onNavigate, onTheme };

  const { rect, beginDrag, beginResize } = useWindowControls();

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
            style={{
              position: 'fixed',
              left: rect.x,
              top: rect.y,
              width: rect.width,
              height: rect.height,
            }}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            onClick={e => e.stopPropagation()}
          >
            {/* ── Title bar ── */}
            <div
              className="terminal-titlebar"
              onPointerDown={beginDrag}
              style={{ cursor: 'grab' }}
            >
              {/* Traffic lights */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={closeTerminal}
                  onPointerDown={(e) => e.stopPropagation()}
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
              <span>drag title · resize corner · ↑↓ history · Tab autocomplete · help</span>
            </div>

            <button
              type="button"
              aria-label="Resize terminal"
              className="terminal-resize-handle"
              onPointerDown={beginResize}
            >
              <span aria-hidden>⋱</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
