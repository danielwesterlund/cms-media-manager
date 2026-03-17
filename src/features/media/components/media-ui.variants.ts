import { cn } from '@/lib/cn';

export function mediaPanel(): string {
  return 'rounded-xl border border-border bg-card text-card-foreground ui-elevation-surface';
}

type ButtonVariant = 'default' | 'danger' | 'outline' | 'ghost' | 'subtle';
type ButtonSize = 'sm' | 'md';

export function mediaButton(opts?: { variant?: ButtonVariant; size?: ButtonSize }): string {
  const variant = opts?.variant ?? 'outline';
  const size = opts?.size ?? 'md';

  return cn(
    'ui-button disabled:pointer-events-none',
    size === 'sm' ? 'ui-button-size-small' : 'ui-button-size-default',
    variant === 'default' && 'ui-button-primary',
    variant === 'danger' && 'ui-button-danger',
    variant === 'outline' && 'ui-button-outline',
    variant === 'ghost' && 'ui-button-ghost',
    variant === 'subtle' && 'ui-button-ghost bg-muted/60'
  );
}

type ChipTone = 'neutral' | 'selected' | 'danger';

export function mediaChip(opts?: { tone?: ChipTone }): string {
  const tone = opts?.tone ?? 'neutral';
  return cn(
    'ui-tag ui-tag-size-small ui-tag-clickable',
    tone === 'neutral' && 'ui-tag-tone-gray',
    tone === 'selected' && 'ui-tag-tone-primary',
    tone === 'danger' && 'ui-tag-tone-danger'
  );
}

type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export function mediaBadge(opts?: { tone?: BadgeTone }): string {
  const tone = opts?.tone ?? 'neutral';
  return cn(
    'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium',
    tone === 'neutral' && 'border-border bg-background text-muted-foreground',
    tone === 'info' && 'border-info/30 bg-info/10 text-info',
    tone === 'success' && 'border-success/30 bg-success/10 text-success',
    tone === 'warning' && 'border-warning/30 bg-warning/10 text-warning',
    tone === 'danger' && 'border-destructive/30 bg-destructive/10 text-destructive'
  );
}

export function selectableSurface(opts?: { selected?: boolean; disabled?: boolean }): string {
  const selected = opts?.selected ?? false;
  const disabled = opts?.disabled ?? false;

  return cn(
    'rounded-lg border border-border bg-card text-card-foreground ui-elevation-surface transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action',
    selected ? 'border-selection-border bg-selection-soft ui-elevation-selected' : 'hover:border-selection-border/50 hover:bg-muted/40',
    disabled && 'pointer-events-none opacity-60'
  );
}
