import { cn } from '@/lib/cn';

export function mediaPanel(): string {
  return 'rounded-xl border border-border bg-card text-card-foreground shadow-sm';
}

type ButtonVariant = 'default' | 'danger' | 'outline' | 'ghost' | 'subtle';
type ButtonSize = 'sm' | 'md';

export function mediaButton(opts?: { variant?: ButtonVariant; size?: ButtonSize }): string {
  const variant = opts?.variant ?? 'outline';
  const size = opts?.size ?? 'md';

  return cn(
    'inline-flex items-center justify-center rounded-md border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action disabled:pointer-events-none disabled:opacity-50',
    size === 'sm' ? 'h-8 px-2 text-xs' : 'h-9 px-3 text-sm',
    variant === 'default' && 'border-action bg-action text-action-foreground hover:bg-action-hover',
    variant === 'danger' && 'border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90',
    variant === 'outline' && 'border-input bg-background hover:bg-muted',
    variant === 'ghost' && 'border-transparent text-foreground hover:bg-muted',
    variant === 'subtle' && 'border-border bg-muted/60 text-foreground hover:bg-muted'
  );
}

type ChipTone = 'neutral' | 'selected' | 'danger';

export function mediaChip(opts?: { tone?: ChipTone }): string {
  const tone = opts?.tone ?? 'neutral';
  return cn(
    'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action',
    tone === 'neutral' && 'border-border bg-muted/70 text-foreground hover:bg-muted',
    tone === 'selected' && 'border-selection-border bg-selection-soft text-selection-foreground hover:bg-selection-soft/80',
    tone === 'danger' && 'border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/15'
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
    'rounded-lg border border-border bg-card text-card-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action',
    selected ? 'border-selection-border bg-selection-soft shadow-md' : 'hover:border-selection-border/50 hover:bg-muted/40',
    disabled && 'pointer-events-none opacity-60'
  );
}
