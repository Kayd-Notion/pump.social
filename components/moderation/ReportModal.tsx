'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

const REASONS = [
  'Spam or scam',
  'Harassment or hate',
  'Violence or threats',
  'Nudity or sexual content',
  'Misinformation',
  'Other',
] as const;

export interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  postId: string;
}

/**
 * Report flow. The full moderation pipeline comes later; for now we capture
 * a reason and acknowledge locally so the UX is complete.
 */
export function ReportModal({ open, onClose, postId }: ReportModalProps) {
  const [reason, setReason] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function submit() {
    // TODO: forward to the moderation service when it exists.
    // eslint-disable-next-line no-console
    console.info('[moderation] report', { postId, reason });
    setSubmitted(true);
  }

  function handleClose() {
    setReason(null);
    setSubmitted(false);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={submitted ? 'Report received' : 'Report post'}
      footer={
        submitted ? (
          <Button onClick={handleClose}>Done</Button>
        ) : (
          <>
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="danger" disabled={!reason} onClick={submit}>
              Submit report
            </Button>
          </>
        )
      }
    >
      {submitted ? (
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          Thanks — our team will review this post. You won&apos;t see a change immediately.
        </p>
      ) : (
        <fieldset className="space-y-2">
          <legend className="mb-2 text-sm text-neutral-600 dark:text-neutral-300">
            Why are you reporting this post?
          </legend>
          {REASONS.map((r) => (
            <label
              key={r}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 p-3 text-sm hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800"
            >
              <input
                type="radio"
                name="report-reason"
                value={r}
                checked={reason === r}
                onChange={() => setReason(r)}
                className="accent-accent"
              />
              {r}
            </label>
          ))}
        </fieldset>
      )}
    </Modal>
  );
}
