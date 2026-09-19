'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
  useWallet as useSolanaWallet,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider, useWalletModal } from '@solana/wallet-adapter-react-ui';
import { getRpcEndpoint } from '@/lib/solana/connection';

// Wallet-adapter modal styles. Neutral by default; safe to re-theme later.
import '@solana/wallet-adapter-react-ui/styles.css';

/**
 * App-level wallet state, layered on top of the Solana wallet adapter.
 *
 * The adapter handles the actual wallet connection; this context adds the
 * product concepts the UI cares about — a resolved `address`, the chosen
 * `username` (onboarding), and whether the user still needs to onboard —
 * and exposes a stable `connected` flag consumed across the app to toggle
 * the visitor banner, enable/disable pump buttons, etc.
 */
export interface AppWalletState {
  connected: boolean;
  connecting: boolean;
  /** Base58 wallet address, when connected. */
  address: string | null;
  /** Chosen pseudo for the connected wallet, if onboarded. */
  username: string | null;
  /** True when connected but no username has been chosen yet. */
  needsOnboarding: boolean;
  /** Open the wallet-selection modal. */
  openConnectModal: () => void;
  /** Disconnect the active wallet. */
  disconnect: () => void;
  /** Persist the chosen username for the connected wallet. */
  setUsername: (username: string) => void;
}

const AppWalletContext = createContext<AppWalletState | null>(null);

const USERNAME_STORAGE_PREFIX = 'pump.social:username:';

function readStoredUsername(address: string | null): string | null {
  if (!address || typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(USERNAME_STORAGE_PREFIX + address);
  } catch {
    return null;
  }
}

/** Inner provider: runs inside the adapter tree, so hooks are available. */
function AppWalletBridge({ children }: { children: ReactNode }) {
  const { publicKey, connected, connecting, disconnect } = useSolanaWallet();
  const { setVisible } = useWalletModal();
  const [username, setUsernameState] = useState<string | null>(null);

  const address = useMemo(() => publicKey?.toBase58() ?? null, [publicKey]);

  useEffect(() => {
    setUsernameState(readStoredUsername(address));
  }, [address]);

  const setUsername = useCallback(
    (name: string) => {
      if (!address) return;
      try {
        window.localStorage.setItem(USERNAME_STORAGE_PREFIX + address, name);
      } catch {
        /* ignore storage failures (private mode, etc.) */
      }
      setUsernameState(name);
    },
    [address],
  );

  const openConnectModal = useCallback(() => setVisible(true), [setVisible]);

  const value = useMemo<AppWalletState>(
    () => ({
      connected,
      connecting,
      address,
      username,
      needsOnboarding: connected && !username,
      openConnectModal,
      disconnect: () => void disconnect().catch(() => undefined),
      setUsername,
    }),
    [connected, connecting, address, username, openConnectModal, disconnect, setUsername],
  );

  return <AppWalletContext.Provider value={value}>{children}</AppWalletContext.Provider>;
}

/** Top-level provider to wrap the whole app (in `app/layout.tsx`). */
export function WalletProvider({ children }: { children: ReactNode }) {
  const endpoint = useMemo(() => getRpcEndpoint(), []);

  // Empty wallet list: rely on Wallet Standard auto-detection for installed
  // and WalletConnect-compatible wallets.
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AppWalletBridge>{children}</AppWalletBridge>
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}

/** Access the app-level wallet state. */
export function useAppWallet(): AppWalletState {
  const ctx = useContext(AppWalletContext);
  if (!ctx) {
    throw new Error('useAppWallet must be used within <WalletProvider>.');
  }
  return ctx;
}
