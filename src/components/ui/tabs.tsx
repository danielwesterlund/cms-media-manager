import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

export type TabItem = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

type TabsProps = {
  value: string;
  onValueChange: (value: string) => void;
  items: TabItem[];
  ariaLabel?: string;
  className?: string;
};

/**
 * DS-aligned horizontal tabs.
 */
export function Tabs({ value, onValueChange, items, ariaLabel = 'Tabs', className }: TabsProps) {
  return (
    <div aria-label={ariaLabel} className={cn('ui-tabs', className)} role="tablist">
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            aria-selected={active}
            className="ui-tabs-trigger"
            data-active={active ? 'true' : 'false'}
            disabled={item.disabled}
            key={item.value}
            onClick={() => onValueChange(item.value)}
            role="tab"
            type="button"
          >
            <span className="ui-tabs-label">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
