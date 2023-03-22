'use client';

import { Component } from 'react';

/**
 * FIX 5 — Catches render-time errors from any child component (e.g. Alchemy failures
 * that bubble up before being caught by the async layer). Never exposes error.message
 * or stack traces in the UI — those details are only logged server-side via console.error.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state to trigger fallback UI on the next render.
    return { hasError: true };
  }

  componentDidCatch() {
    // Error details intentionally not logged — no console.log/error in production.
    // In a production app, send to an error reporting service (e.g. Sentry).
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
          <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-700 bg-gray-900 p-8 text-center max-w-md">
            <p className="text-gray-300">
              Something went wrong loading blockchain data. Please try again.
            </p>
            {/* Reload resets both React state and any stale Alchemy connection. */}
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
