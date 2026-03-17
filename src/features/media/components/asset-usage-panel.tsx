import type { UsageSummary } from '@/features/media/domain/media.types';

type AssetUsagePanelProps = {
  usage: UsageSummary;
};

/**
 * Read-only usage panel with collection-type donut visualization.
 */
export function AssetUsagePanel({ usage }: AssetUsagePanelProps) {
  const rows = getCollectionRows(usage);
  const total = rows.reduce((sum, row) => sum + row.total, 0);

  return (
    <section className="rounded-lg border border-border bg-card p-3" aria-label="Usage summary">
      <h3 className="text-sm font-semibold">Usage Summary</h3>
      <p className="mt-1 text-xs text-muted-foreground">Breakdown by collection type</p>

      <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center">
        <CollectionDonutChart rows={rows} total={total} />
        <div className="min-w-0 flex-1 space-y-1">
          {rows.map((row) => {
            const pct = total > 0 ? Math.round((row.total / total) * 100) : 0;
            return (
              <p className="truncate text-sm" key={row.label}>
                <span className="font-medium">{row.label}:</span> {row.total} ({pct}%)
              </p>
            );
          })}
          <p className="text-xs text-muted-foreground">Total references: {total}</p>
        </div>
      </div>
    </section>
  );
}

function getCollectionRows(usage: UsageSummary): Array<{ label: string; total: number }> {
  const entries = Object.entries(usage.collectionTypes ?? {}).map(([label, counts]) => ({
    label,
    total: counts?.total ?? 0
  }));

  if (entries.length > 0) {
    return [...entries].sort((a, b) => b.total - a.total).slice(0, 7);
  }

  const fallback = usage.total.total > 0 ? usage.total.total : usage.placements.total + usage.projects.total + usage.campaigns.total;
  return [{ label: 'Other', total: fallback }];
}

function CollectionDonutChart({ rows, total }: { rows: Array<{ label: string; total: number }>; total: number }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const safeTotal = Math.max(1, total);
  const tones = [
    'var(--action)',
    'var(--info)',
    'var(--success)',
    'var(--warning)',
    'var(--primary)',
    'var(--destructive)',
    'var(--muted-foreground)'
  ];
  let offset = 0;

  const segments = rows.map((row, index) => {
    const pct = row.total / safeTotal;
    const arc = pct * circumference;
    const segment = {
      label: row.label,
      arc,
      offset,
      color: tones[index % tones.length]
    };
    offset += arc;
    return segment;
  });

  const aria = rows.map((row) => `${row.label} ${row.total}`).join(', ');

  return (
    <svg aria-label={`Collection type usage: ${aria}`} className="h-24 w-24 shrink-0" role="img" viewBox="0 0 64 64">
      <circle cx="32" cy="32" fill="none" r={radius} stroke="var(--muted)" strokeWidth="10" />
      {segments.map((segment) => (
        <circle
          cx="32"
          cy="32"
          fill="none"
          key={segment.label}
          r={radius}
          stroke={segment.color}
          strokeDasharray={`${segment.arc} ${circumference - segment.arc}`}
          strokeDashoffset={-segment.offset}
          strokeLinecap="butt"
          strokeWidth="10"
          transform="rotate(-90 32 32)"
        />
      ))}
      <text className="fill-foreground text-[8px]" textAnchor="middle" x="32" y="33">
        {total}
      </text>
      <text className="fill-muted-foreground text-[6px]" textAnchor="middle" x="32" y="40">
        Uses
      </text>
    </svg>
  );
}
