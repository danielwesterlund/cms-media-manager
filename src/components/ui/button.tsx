import type { ButtonHTMLAttributes } from 'react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'ghostWhite' | 'ai' | 'link';
type ButtonSize = 'hero' | 'default' | 'small';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  trailingIcon?: ReactNode;
  loading?: boolean;
};

export function Button({
  className,
  variant = 'primary',
  size = 'default',
  trailingIcon,
  loading = false,
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      aria-busy={loading || undefined}
      className={cn('ui-button', `ui-button-${variant}`, `ui-button-size-${size}`, className)}
      data-loading={loading ? 'true' : undefined}
      type={type}
      {...props}
    >
      <span className="ui-button-label">{children}</span>
      {trailingIcon ? <span className="ui-button-icon">{trailingIcon}</span> : null}
    </button>
  );
}
