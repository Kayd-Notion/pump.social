'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { PumpAmountPicker } from './PumpAmountPicker';
import { usePump } from '@/hooks/usePump';
import { PUMP_SPLIT } from '@/lib/config';
import { formatSolWithSymbol, shortenAddress } from '@/lib/utils/formatSol';
import type { Post } from '@/types';

export interface PumpConfirmModalProps {
  open: boolean;
  onClose: () => void;
  post: Post;
  /** Called with the new running total after a successful pump. */
  onPumped?: (newTotal: number) => void;
}

type Step = 'select' | 'success';

/**
 * The full pump flow: pick an amount, review the 70/30 split, confirm the
 * (mock) transaction, then see a success state with the signature.
 */
export function PumpConfirmModal({ open, onClose, post, onPumped }: PumpConfirmModalProps) {
  const [amount, setAmount] = useState<number | null>(null);
  const [step, setStep] = useState<Step>('select');
  const { pump, status, result, error, reset } = usePump();

  const split = useMemo(() => {
    if (!amount) return null;
    return {
      creator: amount * PUMP_SPLIT.creatorShare,
      pool: amount * PUMP_SPLIT.poolShare,
    };
  }, [amount]);

  const submitting = status === 'confirming';

  async function confirm() {
    if (!amount) return;
    const res = await pump(post.id, amount, post.totalPumped);
    if (res.success) {
      setStep('success');
      onPumped?.(res.newTotalPumped);
    }
  }

  function handleClose() {
    setAmount(null);
    setStep('select');
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={step === 'success' ? 'Pump confirmed 🚀' : 'Pump this post'}
      footer={
        step === 'success' ? (
          <Button onClick={handleClose} fullWidth>
            Done
          </Button>
        ) : (
          <>
            <Button variant="ghost" onClick={handleClose} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={confirm} loading={submitting} disabled={!amount}>
              {amount ? `Pump ${formatSolWithSymbol(amount)}` : 'Pump'}
            </Button>
          </>
        )
      }
    >
      {step === 'success' ? (
        <div className="space-y-3 text-sm">
          <p className="text-neutral-600 dark:text-neutral-300">
            You pumped{' '}
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              {amount ? formatSolWithSymbol(amount) : ''}
            </span>{' '}
            into @{post.author.username}&apos;s post.
          </p>
          <p className="text-neutral-600 dark:text-neutral-300">
            New total: {formatSolWithSymbol(result?.newTotalPumped ?? post.totalPumped)}
          </p>
          {result?.signature && (
            <p className="break-all rounded-lg bg-neutral-100 p-2 font-mono text-xs text-neutral-500 dark:bg-neutral-800">
              tx {shortenAddress(result.signature, 8)}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <PumpAmountPicker value={amount} onChange={setAmount} />

          {/* Split preview — makes the 70/30 distribution explicit before signing. */}
          <div className="rounded-lg border border-neutral-200 p-3 text-sm dark:border-neutral-800">
            <p className="mb-2 font-medium">How your pump is split</p>
            <div className="flex justify-between text-neutral-600 dark:text-neutral-300">
              <span>Creator ({Math.round(PUMP_SPLIT.creatorShare * 100)}%)</span>
              <span>{split ? formatSolWithSymbol(split.creator) : '—'}</span>
            </div>
            <div className="flex justify-between text-neutral-600 dark:text-neutral-300">
              <span>Reward pool ({Math.round(PUMP_SPLIT.poolShare * 100)}%)</span>
              <span>{split ? formatSolWithSymbol(split.pool) : '—'}</span>
            </div>
            <p className="mt-2 text-xs text-neutral-400">
              The reward pool is redistributed to the top of the leaderboard. Final split is
              enforced on-chain.
            </p>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )}
    </Modal>
  );
}
