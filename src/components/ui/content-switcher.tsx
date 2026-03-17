import { type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/lib/cn';

type ContentSwitcherItem = {
  value: string;
  label?: string;
  icon?: ReactNode;
  disabled?: boolean;
};

type ContentSwitcherProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  items: ContentSwitcherItem[];
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  ariaLabel?: string;
  disabled?: boolean;
};

/**
 * DS content switcher (segmented control) for quick mode switching.
 */
export function ContentSwitcher({
  items,
  value,
  onValueChange,
  label,
  ariaLabel,
  disabled = false,
  className,
  ...props
}: ContentSwitcherProps) {
  return (
    <div className={cn('ui-content-switcher', className)} {...props}>
      {label ? <span className="ui-content-switcher-label">{label}</span> : null}
      <div aria-label={ariaLabel} className="ui-content-switcher-group" role="radiogroup">
        {items.map((item) => {
          const isActive = item.value === value;
          const isDisabled = disabled || item.disabled;
          const isIconOnly = Boolean(item.icon) && !item.label;

          return (
            <button
              aria-checked={isActive}
              className="ui-content-switcher-item"
              data-active={isActive ? 'true' : 'false'}
              data-icon-only={isIconOnly ? 'true' : 'false'}
              disabled={isDisabled}
              key={item.value}
              onClick={() => {
                if (isDisabled || isActive) return;
                onValueChange(item.value);
              }}
              role="radio"
              type="button"
            >
              {item.icon ? <span aria-hidden="true">{item.icon}</span> : null}
              {item.label ? <span className="ui-content-switcher-item-label">{item.label}</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
