'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { QUICK_PUMP_AMOUNTS } from '@/lib/config';
import { validatePumpAmount } from '@/lib/utils/validation';
import { cn } from '@/lib/utils/cn';

export interface PumpAmountPickerProps {
  /** Currently selected amount in SOL (null when nothing valid is chosen). */
  value: number | null;
  onChange: (amount: number | null) => void;
  /** Optional wallet balance to validate against. */
  balance?: number;
}

/**
 * Amount selection for a pump: quick predefined buttons plus a free-form
 * input. Emits the parsed, validated amount (or null) to the parent.
 */
export function PumpAmountPicker({ value, onChange, balance }: PumpAmountPickerProps) {
  const [custom, setCustom] = useState('');
  const [error, setError] = useState<string | null>(null);

  function selectQuick(amount: number) {
    setCustom('');
    setError(null);
    onChange(amount);
  }

  function onCustomChange(raw: string) {
    setCustom(raw);
    if (raw.trim() === '') {
      setError(null);
      onChange(null);
      return;
    }
    const parsed = Number(raw);
    const result = validatePumpAmount(parsed, balance);
    if (result.valid) {
      setError(null);
      onChange(parsed);
    } else {
      setError(result.error ?? 'Invalid amount.');
      onChange(null);
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {QUICK_PUMP_AMOUNTS.map((amount) => {
          const active = custom === '' && value === amount;
          return (
            <button
              key={amount}
              type="button"
              onClick={() => selectQuick(amount)}
              className={cn(
                'rounded-lg border py-2 text-sm font-medium transition',
                active
                  ? 'border-accent bg-accent text-accent-fg'
                  : 'border-neutral-300 hover:border-accent dark:border-neutral-700',
              )}
            >
              {amount} SOL
            </button>
          );
        })}
      </div>

      <div>
        <label className="mb-1 block text-xs text-neutral-500">Or enter a custom amount</label>
        <Input
          type="number"
          inputMode="decimal"
          min={0}
          step="0.001"
          placeholder="0.00"
          prefix="◎"
          value={custom}
          error={error ?? undefined}
          onChange={(e) => onCustomChange(e.target.value)}
        />
      </div>

      {balance !== undefined && (
        <p className="text-xs text-neutral-500">Balance: {balance} SOL</p>
      )}
    </div>
  );
}
