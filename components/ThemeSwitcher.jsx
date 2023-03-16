'use client';

import { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'theme';
const THEMES = [
  { key: 'dark', label: 'Dark', icon: '●' },
  { key: 'dim', label: 'Dim', icon: '◐' },
  { key: 'light', label: 'Light', icon: '○' },
];
const DEFAULT_THEME = 'dark';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Theme switcher — cycles through Dark / Dim / Light.
 * Persists choice in localStorage, applies via data-theme attribute on <html>.
 */
export default function ThemeSwitcher() {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const initial = saved && THEMES.some((t) => t.key === saved) ? saved : DEFAULT_THEME;
    setTheme(initial);
    applyTheme(initial);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function selectTheme(key) {
    setTheme(key);
    applyTheme(key);
    localStorage.setItem(STORAGE_KEY, key);
    setOpen(false);
  }

  const current = THEMES.find((t) => t.key === theme) ?? THEMES[0];

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200 transition-colors"
        aria-label={`Theme: ${current.label}`}
        title={`Theme: ${current.label}`}
      >
        <span className="text-sm">{current.icon}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 overflow-hidden rounded-lg border border-gray-700 bg-gray-900 shadow-xl">
          {THEMES.map((t) => (
            <button
              key={t.key}
              onClick={() => selectTheme(t.key)}
              className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors ${
                theme === t.key
                  ? 'bg-blue-600/10 text-blue-400'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <span className="text-xs">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
