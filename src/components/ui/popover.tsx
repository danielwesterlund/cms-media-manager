import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { cn } from '@/lib/cn';

type PopoverTone = 'primary' | 'ai';

type PopoverContentProps = DropdownMenu.DropdownMenuContentProps & {
  tone?: PopoverTone;
};

type PopoverItemProps = DropdownMenu.DropdownMenuItemProps & {
  danger?: boolean;
};

/**
 * DS popover surface for menu-like overlays.
 */
export function PopoverContent({
  tone = 'primary',
  className,
  children,
  sideOffset = 4,
  ...props
}: PopoverContentProps) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        className={cn('ui-popover ui-elevation-popover', className)}
        data-tone={tone}
        sideOffset={sideOffset}
        {...props}
      >
        <div className="ui-popover-content">
          <div className="ui-popover-items">{children}</div>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  );
}

/**
 * DS popover item row.
 */
export function PopoverItem({ className, danger = false, ...props }: PopoverItemProps) {
  return (
    <DropdownMenu.Item
      className={cn('ui-popover-item', danger && 'ui-popover-item-danger', className)}
      {...props}
    />
  );
}
