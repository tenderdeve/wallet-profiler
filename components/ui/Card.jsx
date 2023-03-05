/**
 * Base card container with consistent dark-mode styling.
 * All dashboard cards and feed items use this as the outer wrapper.
 */
export default function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-xl border border-gray-800 bg-gray-900 p-4 ${className}`}
    >
      {children}
    </div>
  );
}
