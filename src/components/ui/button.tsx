import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({ className, variant = 'primary', type = 'button', ...props }: ButtonProps) {
  return <button className={cn('ui-button', `ui-button-${variant}`, className)} type={type} {...props} />;
}
