'use client';

import { useAppWallet, type AppWalletState } from '@/components/wallet/WalletProvider';

/**
 * App-facing wallet hook. Wraps the wallet adapter with the product-level
 * state the UI needs (address, username, onboarding, connect/disconnect).
 */
export function useWallet(): AppWalletState {
  return useAppWallet();
}
