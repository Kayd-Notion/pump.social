'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Optional error message; renders below the field and reddens the border. */
  error?: string;
  /** Optional leading adornment (e.g. a `@` or `SOL`). */
  prefix?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, prefix, ...props },
  ref,
) {
  return (
    <div className="w-full">
      <div
        className={cn(
          'flex items-center rounded-lg border bg-white px-3 dark:bg-neutral-900',
          error
            ? 'border-red-500'
            : 'border-neutral-300 focus-within:border-accent dark:border-neutral-700',
        )}
      >
        {prefix && <span className="mr-1 select-none text-neutral-500">{prefix}</span>}
        <input
          ref={ref}
          className={cn(
            'h-10 w-full bg-transparent text-sm text-neutral-900 outline-none',
            'placeholder:text-neutral-400 dark:text-neutral-100',
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});
