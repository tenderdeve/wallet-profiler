/**
 * Base card container with depth, subtle gradient border, and hover lift.
 * All dashboard cards and feed items use this as the outer wrapper.
 */
export default function Card({ children, className = '', hover = false }) {
  return (
    <div
      className={`gradient-border rounded-xl border border-gray-800 bg-gray-900 p-4 shadow-lg shadow-black/5 ${hover ? 'card-hover' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
