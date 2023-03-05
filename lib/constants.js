/**
 * Project-wide named constants.
 * No magic numbers or hardcoded strings in components.
 */

// Alchemy
export const ALCHEMY_MAX_TRANSFERS = 50;
export const ALCHEMY_DASHBOARD_TRANSFERS = 200;
export const ALCHEMY_BADGE_TRANSFERS = 100;

// Pagination
export const RECENT_SEARCHES_MAX = 5;
export const FEATURED_WALLETS = [
  {
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    label: 'Vitalik',
  },
  {
    address: '0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8',
    label: 'Binance Hot Wallet',
  },
  {
    address: '0x40B38765696e3d5d8d9d834D8AaD4bB6e418E489',
    label: 'Robinhood',
  },
];

// Wallet badge thresholds
export const BADGE_WHALE_ETH_THRESHOLD = 100;
export const BADGE_NFT_TX_RATIO = 0.35;
export const BADGE_DEFI_TX_RATIO = 0.4;
export const BADGE_NEW_USER_TX_COUNT = 20;

// TX categories
export const TX_CATEGORIES = {
  EXTERNAL: 'external',
  ERC20: 'erc20',
  ERC721: 'erc721',
  ERC1155: 'erc1155',
};

// Explorer base URL (Sepolia testnet)
export const ETHERSCAN_BASE_URL = 'https://sepolia.etherscan.io';

// Chart colors
export const CHART_COLORS = {
  blue: '#3B82F6',
  green: '#10B981',
  purple: '#8B5CF6',
  amber: '#F59E0B',
};

export const PIE_CHART_COLORS = [
  CHART_COLORS.blue,
  CHART_COLORS.green,
  CHART_COLORS.purple,
  CHART_COLORS.amber,
];

// Avatar service
export const AVATAR_BASE_URL = 'https://effigy.im/a';

// Local storage key
export const LOCALSTORAGE_RECENT_SEARCHES = 'recentSearches';
