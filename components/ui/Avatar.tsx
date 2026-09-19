import { cn } from '@/lib/utils/cn';

export interface AvatarProps {
  src?: string;
  alt?: string;
  /** Fallback initials when no image is available. */
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-16 w-16 text-lg',
} as const;

/** Round avatar with an initials fallback. */
export function Avatar({ src, alt, fallback, size = 'md', className }: AvatarProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full',
        'bg-neutral-200 font-medium text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300',
        SIZES[size],
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt ?? ''} className="h-full w-full object-cover" />
      ) : (
        <span aria-hidden>{(fallback ?? '?').slice(0, 2).toUpperCase()}</span>
      )}
    </span>
  );
}
