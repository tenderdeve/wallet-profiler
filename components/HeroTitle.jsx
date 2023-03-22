'use client';

import { useState, useEffect } from 'react';

const ROTATE_INTERVAL_MS = 2500;

const ICON_CLASS = 'h-[0.65em] w-[0.65em]';

const WORDS = [
  {
    text: 'Profiler',
    icon: (
      <svg className={ICON_CLASS} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path strokeLinecap="round" d="m21 21-4.35-4.35" />
        <circle cx="11" cy="11" r="3" />
      </svg>
    ),
  },
  {
    text: 'Analytics',
    icon: (
      <svg className={ICON_CLASS} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l4-8 4 4 5-10" />
      </svg>
    ),
  },
  {
    text: 'Explorer',
    icon: (
      <svg className={ICON_CLASS} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" opacity="0.2" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
  },
  {
    text: 'Tracker',
    icon: (
      <svg className={ICON_CLASS} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h4l3-9 4 18 3-9h6" />
      </svg>
    ),
  },
];

/**
 * Animated hero title with rotating last word and matching icon.
 * "On-Chain [word + icon]" — rolls up every 2.5 seconds.
 * Matches Figma design: Inter bold, tight tracking, #0966C0 accent.
 */
export default function HeroTitle() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % WORDS.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <h1
      className="font-bold text-gray-100"
      style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)', letterSpacing: '-0.02em', lineHeight: 1.3, paddingLeft: '1.5em' }}
    >
      <span>On-Chain</span>
      <span
        className="relative inline-block overflow-hidden align-bottom"
        style={{ height: '1.3em', width: '5.8em', marginLeft: '0.15em' }}
      >
        {WORDS.map((word, i) => {
          const isActive = i === index;
          const isPrev = i === (index - 1 + WORDS.length) % WORDS.length;
          let y = 'translateY(100%)';
          if (isActive) y = 'translateY(0)';
          else if (isPrev) y = 'translateY(-100%)';

          return (
            <span
              key={word.text}
              className="absolute left-0 top-0 flex h-full items-center gap-[0.15em] whitespace-nowrap transition-transform duration-500 ease-in-out"
              style={{ transform: y, opacity: isActive ? 1 : 0 }}
              aria-hidden={!isActive}
            >
              <span style={{ color: '#0966C0' }}>{word.text}</span>
              <span style={{ color: '#0966C0' }}>{word.icon}</span>
            </span>
          );
        })}
      </span>
    </h1>
  );
}
