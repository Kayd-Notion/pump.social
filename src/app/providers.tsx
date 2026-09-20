"use client";
import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import type { Adapter } from "@solana/wallet-adapter-base";
import { rpcEndpoint } from "@/lib/solana";
import { UIProvider } from "@/context/UIContext";
import { SessionProvider } from "@/context/SessionContext";
import { AppShell } from "@/components/AppShell";

export function Providers({ children }: { children: React.ReactNode }) {
  const endpoint = useMemo(() => rpcEndpoint(), []);
  // Empty adapter list: Phantom / Solflare / Backpack (and any others) are
  // auto-detected as Wallet-Standard wallets — no WalletConnect involved.
  const wallets = useMemo<Adapter[]>(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <UIProvider>
          <SessionProvider>
            <AppShell>{children}</AppShell>
          </SessionProvider>
        </UIProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
