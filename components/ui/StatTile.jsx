/**
 * A single stat display tile — label on top, value below.
 * Used in the wallet profile header row.
 */

/**
 * @param {Object} props
 * @param {string} props.label - e.g. "ETH Balance"
 * @param {string|number} props.value - e.g. "1.2345" or "42"
 * @param {string} [props.suffix] - Optional unit, e.g. "days", "NFTs"
 */
export default function StatTile({ label, value, suffix }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-gray-800 bg-gray-900 p-4">
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
