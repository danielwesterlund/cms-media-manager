import type { DragEvent, ReactNode } from 'react';

import { cn } from '@/lib/cn';

type TreeRowProps = {
  depth: number;
  label: ReactNode;
  active?: boolean;
  selected?: boolean;
  section?: boolean;
  expanded?: boolean;
  showFolderIcon?: boolean;
  trailing?: ReactNode;
  onToggle?: () => void;
  onSelect?: () => void;
  onDragOver?: (event: DragEvent<HTMLElement>) => void;
  onDrop?: (event: DragEvent<HTMLElement>) => void;
  className?: string;
  labelClassName?: string;
};

/**
 * Single row of a tree with indentation and folder icon toggle.
 */
export function TreeRow({
  depth,
  label,
  active = false,
  selected = false,
  section = false,
  expanded = false,
  showFolderIcon = true,
  trailing,
  onToggle,
  onSelect,
  onDragOver,
  onDrop,
  className,
  labelClassName
}: TreeRowProps) {
  return (
    <div className={cn('ui-tree-row', className)}>
      <div
        className="ui-tree-content"
        data-section={section ? 'true' : 'false'}
        data-selected={selected ? 'true' : 'false'}
        style={{ paddingLeft: `calc(var(--tree-margin-left-default) + (${depth} * var(--tree-spacer)))` }}
      >
        {showFolderIcon ? (
          <button
            aria-label={expanded ? 'Collapse folder' : 'Expand folder'}
            className="ui-tree-icon-button"
            onClick={onToggle}
            type="button"
          >
            <span aria-hidden="true" className="material-symbols-outlined">
              {expanded ? 'folder_open' : 'folder'}
            </span>
          </button>
        ) : null}

        <button
          className={cn('ui-tree-label', labelClassName)}
          data-active={active ? 'true' : 'false'}
          onClick={onSelect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          type="button"
        >
          <span className="ui-tree-label-text">{label}</span>
        </button>

        {trailing}
      </div>
    </div>
  );
}
