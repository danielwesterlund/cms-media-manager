import { forwardRef, type ReactNode, type SelectHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  children: ReactNode;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, children, ...props },
  ref
) {
  return (
    <span className={cn('ui-select-wrap', className)}>
      <select className="ui-select" ref={ref} {...props}>
        {children}
      </select>
      <span aria-hidden="true" className="ui-select-icon material-symbols-outlined">
        keyboard_arrow_down
      </span>
    </span>
  );
});
