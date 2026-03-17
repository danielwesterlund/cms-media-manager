import { useState, type ReactNode } from 'react';

import { IconButton } from '@/components/ui/icon-button';
import { cn } from '@/lib/cn';

type AccordionItemProps = {
  id: string;
  title: string;
  defaultOpen?: boolean;
  badgeCount?: number;
  tagLabel?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  children: ReactNode;
  className?: string;
};

/**
 * DS-aligned accordion item with optional badge/tag and header action.
 */
export function AccordionItem({
  id,
  title,
  defaultOpen = false,
  badgeCount,
  tagLabel,
  actionLabel,
  onActionClick,
  children,
  className
}: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = `${id}-content`;

  return (
    <section className={cn('ui-accordion-item', className)}>
      <div className="ui-accordion-header">
        <button
          aria-controls={contentId}
          aria-expanded={open}
          className="ui-accordion-trigger"
          onClick={() => setOpen((current) => !current)}
          type="button"
        >
          <span className="ui-accordion-title">{title}</span>
          {typeof badgeCount === 'number' && badgeCount > 0 ? <span className="ui-accordion-badge">{badgeCount}</span> : null}
          {tagLabel ? <span className="ui-accordion-tag">{tagLabel}</span> : null}
        </button>

        <div className="ui-accordion-controls">
          {actionLabel && onActionClick ? (
            <button className="ui-accordion-action" onClick={onActionClick} type="button">
              {actionLabel}
            </button>
          ) : null}
          <IconButton
            aria-controls={contentId}
            aria-expanded={open}
            aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
            className="ui-accordion-toggle"
            icon={<span aria-hidden="true" className="material-symbols-outlined">{open ? 'remove' : 'add'}</span>}
            onClick={() => setOpen((current) => !current)}
            size="small"
            variant="secondary"
          />
        </div>
      </div>

      {open ? (
        <div className="ui-accordion-content" id={contentId}>
          {children}
        </div>
      ) : null}
    </section>
  );
}
