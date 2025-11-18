import { cn } from '@/lib/utils';
import LoadingHouse from './LoadingHouse';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'default' | 'house'; // New: choose between classic spinner or house loader
}

export function Spinner({ size = 'md', className, variant = 'house' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-3',
  };

  const houseSizes = {
    sm: 24,
    md: 40,
    lg: 60,
  };

  // Use EasyCo house loader by default
  if (variant === 'house') {
    return (
      <div className={cn('inline-flex items-center justify-center', className)} role="status">
        <LoadingHouse size={houseSizes[size]} />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  // Classic spinner fallback
  return (
    <div
      className={cn(
        'inline-block animate-spin rounded-full border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]',
        sizeClasses[size],
        className
      )}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
