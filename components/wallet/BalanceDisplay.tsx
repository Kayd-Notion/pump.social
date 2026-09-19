'use client';

import { useEffect, useState } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useWallet } from '@/hooks/useWallet';
import { formatSolWithSymbol } from '@/lib/utils/formatSol';
import { cn } from '@/lib/utils/cn';

export interface BalanceDisplayProps {
  className?: string;
}

/**
 * Live SOL balance for the connected wallet. Reads the balance from the RPC
 * connection; on failure (e.g. no funded devnet account) it simply shows a
 * dash rather than erroring.
 */
export function BalanceDisplay({ className }: BalanceDisplayProps) {
  const { connection } = useConnection();
  const { connected, address } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!connected || !address) {
      setBalance(null);
      return;
    }
    let cancelled = false;
    connection
      .getBalance(new PublicKey(address))
      .then((lamports) => {
        if (!cancelled) setBalance(lamports / LAMPORTS_PER_SOL);
      })
      .catch(() => {
        if (!cancelled) setBalance(null);
      });
    return () => {
      cancelled = true;
    };
  }, [connection, connected, address]);

  if (!connected) return null;

  return (
    <span className={cn('text-sm font-medium tabular-nums', className)}>
      {balance === null ? '—' : formatSolWithSymbol(balance)}
    </span>
  );
}
