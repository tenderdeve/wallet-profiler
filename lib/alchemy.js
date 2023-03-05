import { Alchemy, Network } from 'alchemy-sdk';
import config from './config';

/**
 * Maps the NEXT_PUBLIC_CHAIN env value to an Alchemy Network constant.
 * Add entries here if more chains are needed in future.
 */
const NETWORK_MAP = {
  'eth-sepolia': Network.ETH_SEPOLIA,
  'eth-mainnet': Network.ETH_MAINNET, // listed for completeness — not used in this project
};

const network = NETWORK_MAP[config.alchemy.chain];

if (!network) {
  throw new Error(
    `Unsupported chain "${config.alchemy.chain}". ` +
      `Valid options: ${Object.keys(NETWORK_MAP).join(', ')}`
  );
}

/**
 * Singleton Alchemy SDK instance.
 * Import this anywhere SDK access is needed — never instantiate Alchemy elsewhere.
 */
export const alchemy = new Alchemy({
  apiKey: config.alchemy.apiKey,
  network,
});
