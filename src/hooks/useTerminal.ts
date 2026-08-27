/**
 * useTerminal.ts
 * Custom hook managing all terminal state: open/close, history, input,
 * arrow-key navigation through command history, and boot sequence.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { executeCommand, TerminalLine } from '../commands/commandEngine.ts';

export interface UseTerminalReturn {
  isOpen: boolean;
  openTerminal: () => void;
  closeTerminal: () => void;
  toggleTerminal: () => void;

  lines: TerminalLine[];
  inputValue: string;
  setInputValue: (v: string) => void;

  handleSubmit: (
    input: string,
    callbacks: {
      onNavigate: (section: string) => void;
      onTheme: (t: 'dark' | 'light') => void;
    }
  ) => void;

  handleKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    callbacks: {
      onNavigate: (section: string) => void;
      onTheme: (t: 'dark' | 'light') => void;
    }
  ) => void;

  inputRef: React.RefObject<HTMLInputElement | null>;
  outputRef: React.RefObject<HTMLDivElement | null>;
  bootDone: boolean;
}

let _idCounter = 0;
function uid() { return String(++_idCounter); }

const BOOT_SEQUENCE = [
  { type: 'dim' as const,     text: 'Initializing secure shell session…' },
  { type: 'dim' as const,     text: 'Loading portfolio modules…' },
  { type: 'success' as const, text: '✓ All systems operational.' },
  { type: 'dim' as const,     text: '' },
  { type: 'info' as const,    text: "Type 'help' for available commands." },
  { type: 'dim' as const,     text: '' },
];

export function useTerminal(): UseTerminalReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [bootDone, setBootDone] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const outputRef = useRef<HTMLDivElement | null>(null);
  const bootRanRef = useRef(false);

  // Auto-scroll output to bottom whenever lines change
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus input whenever terminal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  // Typed boot sequence – runs only once on first open
  const runBoot = useCallback(() => {
    if (bootRanRef.current) return;
    bootRanRef.current = true;

    let delay = 0;
    BOOT_SEQUENCE.forEach((l, i) => {
      delay += i === 0 ? 0 : 120;
      setTimeout(() => {
        setLines(prev => [...prev, { id: uid(), type: l.type, text: l.text }]);
      }, delay);
    });
    setTimeout(() => setBootDone(true), delay + 150);
  }, []);

  const openTerminal = useCallback(() => {
    setIsOpen(true);
    runBoot();
  }, [runBoot]);

  const closeTerminal = useCallback(() => setIsOpen(false), []);
  const toggleTerminal = useCallback(() => {
    setIsOpen(prev => {
      if (!prev) runBoot();
      return !prev;
    });
  }, [runBoot]);

  const appendLines = useCallback((newLines: TerminalLine[]) => {
    setLines(prev => [...prev, ...newLines]);
  }, []);

  const handleSubmit = useCallback(
    (
      input: string,
      { onNavigate, onTheme }: { onNavigate: (s: string) => void; onTheme: (t: 'dark' | 'light') => void }
    ) => {
      const trimmed = input.trim();

      // Echo the user's prompt line
      appendLines([{ id: uid(), type: 'prompt', text: trimmed }]);

      if (trimmed) {
        setCmdHistory(prev => [trimmed, ...prev.slice(0, 49)]);
        setHistoryIndex(-1);
      }

      const result = executeCommand(trimmed);

      if (result.clear) {
        setLines([]);
      } else {
        appendLines(result.lines);
      }

      if (result.navigate) {
        setTimeout(() => onNavigate(result.navigate!), 320);
      }
      if (result.theme) {
        onTheme(result.theme);
      }
      if (result.exit) {
        setTimeout(() => setIsOpen(false), 600);
      }

      setInputValue('');
    },
    [appendLines]
  );

  const handleKeyDown = useCallback(
    (
      e: React.KeyboardEvent<HTMLInputElement>,
      callbacks: { onNavigate: (s: string) => void; onTheme: (t: 'dark' | 'light') => void }
    ) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit(inputValue, callbacks);
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        setLines([]);
        return;
      }

      if (e.key === 'PageUp' || e.key === 'PageDown') {
        e.preventDefault();
        outputRef.current?.scrollBy({ top: e.key === 'PageUp' ? -outputRef.current.clientHeight * 0.8 : outputRef.current.clientHeight * 0.8, behavior: 'smooth' });
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHistoryIndex(prev => {
          const next = Math.min(prev + 1, cmdHistory.length - 1);
          setInputValue(cmdHistory[next] ?? '');
          return next;
        });
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHistoryIndex(prev => {
          const next = prev - 1;
          if (next < 0) { setInputValue(''); return -1; }
          setInputValue(cmdHistory[next] ?? '');
          return next;
        });
        return;
      }

      if (e.key === 'Tab') {
        if (e.shiftKey) return;
        e.preventDefault();
        // Simple tab completion for known commands
        const COMPLETIONS = [
          'help', 'whoami', 'ls', 'date', 'uname', 'clear', 'exit',
          'cat about', 'cat skills', 'cat experience', 'cat certificates', 'cat portfolio',
          'ping contact',
          'goto home', 'goto about', 'goto skills', 'goto experience',
          'goto certificates', 'goto portfolio', 'goto blog', 'goto contact',
          'theme dark', 'theme light',
        ];
        const match = COMPLETIONS.find(c => c.startsWith(inputValue) && c !== inputValue);
        if (match) setInputValue(match);
      }
    },
    [inputValue, cmdHistory, handleSubmit]
  );

  return {
    isOpen,
    openTerminal,
    closeTerminal,
    toggleTerminal,
    lines,
    inputValue,
    setInputValue,
    handleSubmit,
    handleKeyDown,
    inputRef,
    outputRef,
    bootDone,
  };
}
