import { forwardRef, useId, type ChangeEventHandler, type InputHTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/lib/cn';

type RadioTone = 'default' | 'ai';

type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  label?: ReactNode;
  tone?: RadioTone;
};

type RadioGroupProps = {
  name: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ value: string; label: ReactNode; disabled?: boolean }>;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
};

/**
 * DS-aligned radio input.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { className, label, checked = false, disabled = false, id, onChange, tone = 'default', ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? `ui-radio-${generatedId}`;

  return (
    <label
      className={cn('ui-radio', className)}
      data-disabled={disabled ? 'true' : 'false'}
      data-tone={tone}
      htmlFor={inputId}
    >
      <span className="ui-radio-control">
        <input
          {...props}
          aria-checked={checked}
          checked={checked}
          className="ui-radio-input"
          disabled={disabled}
          id={inputId}
          onChange={onChange as ChangeEventHandler<HTMLInputElement> | undefined}
          ref={ref}
          type="radio"
        />
        <span className="ui-radio-icon-wrap" aria-hidden="true">
          <span className="material-symbols-outlined ui-radio-icon">
            {checked ? 'radio_button_checked' : 'radio_button_unchecked'}
          </span>
        </span>
      </span>
      {label ? <span className="ui-radio-label">{label}</span> : null}
    </label>
  );
});

/**
 * Controlled radio group helper.
 */
export function RadioGroup({ name, value, onValueChange, options, className, orientation = 'vertical' }: RadioGroupProps) {
  return (
    <div className={cn('ui-radio-group', className)} data-orientation={orientation} role="radiogroup">
      {options.map((option) => (
        <Radio
          checked={option.value === value}
          disabled={option.disabled}
          key={option.value}
          label={option.label}
          name={name}
          onChange={() => onValueChange(option.value)}
          value={option.value}
        />
      ))}
    </div>
  );
}
