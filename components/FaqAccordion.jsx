'use client';

import { useState } from 'react';

/**
 * FAQ accordion — only one item open at a time.
 * First item open by default.
 *
 * @param {{ items: Array<{ q: string, a: string }> }} props
 */
export default function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="flex-1 space-y-3">
      {items.map((faq, i) => (
        <div
          key={faq.q}
          className="rounded-xl border border-gray-800/80 bg-gray-900/40 backdrop-blur-sm transition-colors hover:border-gray-700/80"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
            className="flex w-full cursor-pointer items-center justify-between px-6 py-5 text-left text-sm font-medium text-gray-100"
          >
            <span>{faq.q}</span>
            <svg
              className={`ml-4 h-4 w-4 shrink-0 text-gray-500 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          {openIndex === i && (
            <div className="border-t border-gray-800/50 px-6 py-4">
              <p className="text-sm leading-relaxed text-gray-400">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
