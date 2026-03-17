import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/lib/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  trailingIcon?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, trailingIcon, ...props },
  ref
) {
  if (!trailingIcon) {
    return <input className={cn('ui-input', className)} ref={ref} {...props} />;
  }

  return (
    <span className={cn('ui-input-wrap', className)}>
      <input className="ui-input ui-input-with-icon" ref={ref} {...props} />
      <span className="ui-input-icon" aria-hidden="true">
        {trailingIcon}
      </span>
    </span>
  );
});
