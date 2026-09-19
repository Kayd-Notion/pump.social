'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { validateUsername } from '@/lib/utils/validation';

export interface UsernamePickerProps {
  /** Prefill (e.g. when editing an existing pseudo). */
  initialValue?: string;
  /** Called with the validated username on submit. */
  onSubmit: (username: string) => void;
  submitLabel?: string;
  loading?: boolean;
}

/**
 * Reusable username/pseudo chooser used in onboarding and profile settings.
 * Validation is local; uniqueness will be enforced on-chain / by the indexer.
 */
export function UsernamePicker({
  initialValue = '',
  onSubmit,
  submitLabel = 'Continue',
  loading,
}: UsernamePickerProps) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = validateUsername(value);
    if (!result.valid) {
      setError(result.error ?? 'Invalid username.');
      return;
    }
    setError(null);
    onSubmit(value.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="mb-1 block text-sm font-medium">
          Choose a username
        </label>
        <Input
          id="username"
          prefix="@"
          placeholder="satoshigirl"
          value={value}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          error={error ?? undefined}
          onChange={(e) => setValue(e.target.value)}
        />
        <p className="mt-1 text-xs text-neutral-400">
          3–20 characters. Letters, numbers and underscores.
        </p>
      </div>
      <Button type="submit" fullWidth loading={loading}>
        {submitLabel}
      </Button>
    </form>
  );
}
