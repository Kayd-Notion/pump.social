'use client';

import { useCallback, useState } from 'react';
import type { PumpResult } from '@/types';
import { sendPump } from '@/lib/solana/transactions';
import { useWallet } from './useWallet';

type PumpStatus = 'idle' | 'confirming' | 'success' | 'error';

interface UsePumpResult {
  status: PumpStatus;
  result: PumpResult | null;
  error: string | null;
  /** Submit a pump. Returns the result (also stored on the hook). */
  pump: (postId: string, amount: number, currentTotal: number) => Promise<PumpResult>;
  reset: () => void;
}

/**
 * Drives a single pump transaction. Requires a connected wallet; the actual
 * on-chain send is delegated to the (currently mocked) Solana layer.
 */
export function usePump(): UsePumpResult {
  const { connected, address } = useWallet();
  const [status, setStatus] = useState<PumpStatus>('idle');
  const [result, setResult] = useState<PumpResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pump = useCallback(
    async (postId: string, amount: number, currentTotal: number): Promise<PumpResult> => {
      if (!connected || !address) {
        const err = 'Connect a wallet to pump.';
        setError(err);
        setStatus('error');
        return { success: false, newTotalPumped: currentTotal, error: err };
      }

      setStatus('confirming');
      setError(null);
      try {
        const res = await sendPump({ postId, amount, from: address, currentTotal });
        setResult(res);
        if (res.success) {
          setStatus('success');
        } else {
          setStatus('error');
          setError(res.error ?? 'Pump failed.');
        }
        return res;
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Pump failed.';
        setStatus('error');
        setError(message);
        return { success: false, newTotalPumped: currentTotal, error: message };
      }
    },
    [connected, address],
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setError(null);
  }, []);

  return { status, result, error, pump, reset };
}
