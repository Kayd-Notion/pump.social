import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { SOLANA_CLUSTER } from '@/lib/config';

/**
 * Wallet-adapter configuration. We keep the wallet list intentionally small
 * and rely on the Wallet Standard auto-detection built into the adapter,
 * which discovers installed wallets (Phantom, Solflare, Backpack, …) plus
 * any WalletConnect-compatible wallet the user configures.
 */

export function getWalletNetwork(): WalletAdapterNetwork {
  switch (SOLANA_CLUSTER) {
    case 'mainnet-beta':
      return WalletAdapterNetwork.Mainnet;
    case 'testnet':
      return WalletAdapterNetwork.Testnet;
    case 'devnet':
    default:
      return WalletAdapterNetwork.Devnet;
  }
}
