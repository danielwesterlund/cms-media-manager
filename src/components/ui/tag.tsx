import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/cn';

export type TagSize = 'small' | 'large';
export type TagTone = 'white' | 'gray' | 'primary' | 'secondary' | 'black' | 'success' | 'ai' | 'warning' | 'danger';

type BaseTagProps = {
  size?: TagSize;
  tone?: TagTone;
  closeable?: boolean;
  clickable?: boolean;
  onClose?: () => void;
  children: ReactNode;
  className?: string;
};

type TagButtonProps = BaseTagProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children'> & {
    as?: 'button';
  };

type TagSpanProps = BaseTagProps &
  Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
    as?: 'span';
  };

type TagProps = TagButtonProps | TagSpanProps;

/**
 * DS-aligned tag/chip. Supports static, clickable, and closeable variants.
 */
export function Tag({
  as = 'span',
  size = 'small',
  tone = 'gray',
  closeable = false,
  clickable = false,
  onClose,
  children,
  className,
  ...props
}: TagProps) {
  const baseClassName = cn(
    'ui-tag',
    `ui-tag-size-${size}`,
    `ui-tag-tone-${tone}`,
    clickable && 'ui-tag-clickable',
    closeable && 'ui-tag-closeable',
    className
  );

  const content = (
    <>
      <span className="ui-tag-label">{children}</span>
      {closeable ? (
        <button
          aria-label={typeof children === 'string' ? `Remove ${children}` : 'Remove tag'}
          className="ui-tag-close"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onClose?.();
          }}
          type="button"
        >
          <span aria-hidden="true" className="material-symbols-outlined">close</span>
        </button>
      ) : null}
    </>
  );

  if (as === 'button') {
    const buttonProps = props as Omit<TagButtonProps, keyof BaseTagProps | 'as'>;
    return (
      <button className={baseClassName} type="button" {...buttonProps}>
        {content}
      </button>
    );
  }

  const spanProps = props as Omit<TagSpanProps, keyof BaseTagProps | 'as'>;
  return (
    <span className={baseClassName} {...spanProps}>
      {content}
    </span>
  );
}
