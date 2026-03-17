import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/lib/cn';

type IconButtonVariant = 'primary' | 'secondary' | 'ghost' | 'ghostWhite' | 'ai';
type IconButtonSize = 'big' | 'small' | 'xsmall';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  icon: ReactNode;
  loading?: boolean;
};

/**
 * DS-aligned icon-only button.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  {
    className,
    variant = 'ghost',
    size = 'small',
    icon,
    loading = false,
    type = 'button',
    ...props
  },
  ref
) {
  return (
    <button
      aria-busy={loading || undefined}
      className={cn('ui-icon-button', `ui-icon-button-${variant}`, `ui-icon-button-size-${size}`, className)}
      data-loading={loading ? 'true' : undefined}
      ref={ref}
      type={type}
      {...props}
    >
      <span className="ui-icon-button-icon">{icon}</span>
    </button>
  );
});
