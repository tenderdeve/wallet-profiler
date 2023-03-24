'use client';

import { useState, useCallback, useRef } from 'react';

/**
 * FAQ accordion — only one item open at a time.
 * First item open by default. Arrow keys navigate between questions.
 *
 * @param {{ items: Array<{ q: string, a: string }> }} props
 */
export default function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);
  const buttonsRef = useRef([]);

  const handleKeyDown = useCallback((e, i) => {
    let target = -1;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      target = (i + 1) % items.length;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      target = (i - 1 + items.length) % items.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      target = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      target = items.length - 1;
    }
    if (target >= 0) buttonsRef.current[target]?.focus();
  }, [items.length]);

  return (
    <div className="flex-1 space-y-3" role="region" aria-label="Frequently Asked Questions">
      {items.map((faq, i) => {
        const isOpen = openIndex === i;
        const panelId = `faq-panel-${i}`;
        const buttonId = `faq-button-${i}`;

        return (
          <div
            key={faq.q}
            className="rounded-xl border border-gray-800 bg-gray-900 transition-colors hover:border-gray-700"
          >
            <button
              ref={(el) => { buttonsRef.current[i] = el; }}
              id={buttonId}
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="flex w-full cursor-pointer items-center justify-between rounded-xl px-6 py-5 text-left text-sm font-medium text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <span>{faq.q}</span>
              <svg
                className={`ml-4 h-4 w-4 shrink-0 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="border-t border-gray-800 px-6 py-4"
              >
                <p className="text-sm leading-relaxed text-gray-400">{faq.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
