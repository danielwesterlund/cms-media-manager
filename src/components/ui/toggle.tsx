import { type HTMLAttributes, type MouseEvent } from 'react';

import { cn } from '@/lib/cn';

type ToggleLabelPosition = 'inline' | 'above';

type ToggleProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  labelLeft?: string;
  labelRight?: string;
  labelPosition?: ToggleLabelPosition;
  ariaLabel?: string;
};

/**
 * DS toggle switch with optional above/inline labels.
 */
export function Toggle({
  checked,
  onCheckedChange,
  disabled = false,
  label,
  labelLeft = 'Off',
  labelRight = 'On',
  labelPosition = 'inline',
  ariaLabel,
  className,
  ...props
}: ToggleProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (disabled) return;
    onCheckedChange(!checked);
  };

  return (
    <div
      className={cn('ui-toggle', className)}
      data-checked={checked ? 'true' : 'false'}
      data-disabled={disabled ? 'true' : 'false'}
      data-label-position={labelPosition}
      {...props}
    >
      {label ? <span className="ui-toggle-label">{label}</span> : null}
      <div className="ui-toggle-content">
        {labelLeft ? (
          <span className="ui-toggle-option ui-toggle-option-left">
            {labelLeft}
          </span>
        ) : null}
        <button
          aria-checked={checked}
          aria-disabled={disabled || undefined}
          aria-label={ariaLabel ?? label ?? `${labelLeft} / ${labelRight}`}
          className="ui-toggle-control"
          disabled={disabled}
          onClick={handleClick}
          role="switch"
          type="button"
        >
          <span aria-hidden="true" className="ui-toggle-thumb" />
        </button>
        {labelRight ? (
          <span className="ui-toggle-option ui-toggle-option-right">
            {labelRight}
          </span>
        ) : null}
      </div>
    </div>
  );
}
