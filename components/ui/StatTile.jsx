/**
 * A single stat display tile — label on top, value below.
 * Gradient border accent with hover lift.
 */
export default function StatTile({ label, value, suffix }) {
  return (
    <div className="gradient-border card-hover flex flex-col gap-1 rounded-xl border border-gray-800 bg-gray-900 p-4 shadow-lg shadow-black/5">
      <span className="text-xs font-medium uppercase tracking-widest text-gray-500">
        {label}
      </span>
      <span className="text-2xl font-bold text-gray-100">
        {value}
        {suffix && (
          <span className="ml-1 text-sm font-normal text-gray-400">
            {suffix}
          </span>
        )}
      </span>
    </div>
  );
}
