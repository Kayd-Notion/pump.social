import { cn } from '@/lib/utils/cn';

/** Simple loading spinner. */
export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-400 border-t-transparent',
        className,
      )}
    />
  );
}
