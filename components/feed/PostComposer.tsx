'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { useWallet } from '@/hooks/useWallet';
import { sendPost } from '@/lib/solana/transactions';
import { MAX_POST_LENGTH, validatePostText } from '@/lib/utils/validation';
import { cn } from '@/lib/utils/cn';

export interface PostComposerProps {
  /** Called after a post is (mock) published. */
  onPosted?: () => void;
}

/**
 * Post composer. Writing is a wallet action, so visitors see a connect
 * prompt instead of the editor. Media attachment is stubbed (name captured)
 * until storage is wired.
 */
export function PostComposer({ onPosted }: PostComposerProps) {
  const { connected, username, openConnectModal } = useWallet();
  const [text, setText] = useState('');
  const [mediaName, setMediaName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!connected) {
    return (
      <div className="flex items-center justify-between gap-3 border-b border-neutral-200 p-4 dark:border-neutral-800">
        <p className="text-sm text-neutral-500">Connect your wallet to post.</p>
        <Button size="sm" onClick={openConnectModal}>
          Connect wallet
        </Button>
      </div>
    );
  }

  const remaining = MAX_POST_LENGTH - text.length;

  async function submit() {
    const check = validatePostText(text, mediaName !== null);
    if (!check.valid) {
      setError(check.error ?? 'Invalid post.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await sendPost(text.trim(), mediaName !== null);
      setText('');
      setMediaName(null);
      onPosted?.();
    } catch {
      setError('Failed to publish. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="border-b border-neutral-200 p-4 dark:border-neutral-800">
      <div className="flex gap-3">
        <Avatar fallback={username ?? '?'} />
        <div className="min-w-0 flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's pumping?"
            rows={3}
            className="w-full resize-none bg-transparent text-[15px] outline-none placeholder:text-neutral-400"
          />
          {mediaName && (
            <div className="mb-2 flex items-center gap-2 text-xs text-neutral-500">
              <span className="truncate">📎 {mediaName}</span>
              <button onClick={() => setMediaName(null)} className="text-red-500">
                remove
              </button>
            </div>
          )}
          {error && <p className="mb-2 text-xs text-red-500">{error}</p>}
          <div className="flex items-center justify-between">
            <label className="cursor-pointer text-sm text-accent hover:underline">
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => setMediaName(e.target.files?.[0]?.name ?? null)}
              />
              Add photo / video
            </label>
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'text-xs tabular-nums',
                  remaining < 0 ? 'text-red-500' : 'text-neutral-400',
                )}
              >
                {remaining}
              </span>
              <Button size="sm" onClick={submit} loading={submitting} disabled={remaining < 0}>
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
