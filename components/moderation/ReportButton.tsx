'use client';

import { useState } from 'react';
import { ReportModal } from './ReportModal';
import { cn } from '@/lib/utils/cn';

export interface ReportButtonProps {
  postId: string;
  className?: string;
}

/** Small "report" affordance shown on every post, opening the report modal. */
export function ReportButton({ postId, className }: ReportButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Report post"
        title="Report post"
        className={cn(
          'inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-400',
          'hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800',
          className,
        )}
      >
        {/* flag icon */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" y1="22" x2="4" y2="15" />
        </svg>
      </button>
      <ReportModal open={open} onClose={() => setOpen(false)} postId={postId} />
    </>
  );
}
