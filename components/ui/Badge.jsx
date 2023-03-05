/**
 * Personality badge pill component.
 * Color variant is derived from badge type.
 */

const VARIANT_CLASSES = {
  whale: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  nft: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  defi: 'bg-green-500/20 text-green-400 border-green-500/30',
  new: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  default: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

/**
 * @param {Object} props
 * @param {string} props.label - Display text including emoji
 * @param {'whale'|'nft'|'defi'|'new'|'default'} [props.variant='default']
 */
export default function Badge({ label, variant = 'default' }) {
  const classes = VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.default;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${classes}`}
    >
      {label}
    </span>
  );
}
