import { forwardRef, useEffect, useId, useRef, type ChangeEventHandler, type InputHTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/lib/cn';

type CheckboxTone = 'default' | 'addon' | 'ai';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  label?: ReactNode;
  indeterminate?: boolean;
  tone?: CheckboxTone;
};

type CheckboxIndicatorProps = {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  className?: string;
};

function iconName(checked: boolean, indeterminate: boolean): string {
  if (indeterminate) return 'indeterminate_check_box';
  return checked ? 'check_box' : 'check_box_outline_blank';
}

/**
 * DS-aligned checkbox control.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { className, label, checked = false, disabled = false, indeterminate = false, id, onChange, tone = 'default', ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? `ui-checkbox-${generatedId}`;
  const internalRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (internalRef.current) {
      internalRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label
      className={cn('ui-checkbox', className)}
      data-disabled={disabled ? 'true' : 'false'}
      data-tone={tone}
      htmlFor={inputId}
    >
      <span className="ui-checkbox-control">
        <input
          {...props}
          aria-checked={indeterminate ? 'mixed' : checked}
          checked={checked}
          className="ui-checkbox-input"
          disabled={disabled}
          id={inputId}
          onChange={onChange as ChangeEventHandler<HTMLInputElement> | undefined}
          ref={(node) => {
            internalRef.current = node;
            if (!ref) return;
            if (typeof ref === 'function') ref(node);
            else ref.current = node;
          }}
          type="checkbox"
        />
        <span className="ui-checkbox-icon-wrap" aria-hidden="true">
          <span className="material-symbols-outlined ui-checkbox-icon">{iconName(Boolean(checked), indeterminate)}</span>
        </span>
      </span>
      {label ? <span className="ui-checkbox-label">{label}</span> : null}
    </label>
  );
});

/**
 * Non-interactive checkbox marker used inside selectable cards/rows.
 */
export function CheckboxIndicator({ checked = false, indeterminate = false, disabled = false, className }: CheckboxIndicatorProps) {
  return (
    <span className={cn('ui-checkbox-indicator', className)} data-disabled={disabled ? 'true' : 'false'} aria-hidden="true">
      <span className="material-symbols-outlined ui-checkbox-icon">{iconName(checked, indeterminate)}</span>
    </span>
  );
}
