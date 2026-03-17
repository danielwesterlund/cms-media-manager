import type { UploadJob } from '@/features/media/domain/media.types';
import { mediaBadge, mediaButton, mediaPanel } from '@/features/media/components/media-ui.variants';
import { cn } from '@/lib/cn';

type UploadTrayProps = {
  jobs: UploadJob[];
  onCancel: (jobId: string) => void;
  onRetry: (jobId: string) => void;
  onRemove: (jobId: string) => void;
  onCopyError: (jobId: string) => void;
};

/**
 * Presentational upload tray with per-job controls.
 */
export function UploadTray({ jobs, onCancel, onRetry, onRemove, onCopyError }: UploadTrayProps) {
  return (
    <section aria-label="Upload tray" className={cn(mediaPanel(), 'p-3')}>
      <h2 className="ui-type-body-2-strong mb-2">Uploads</h2>

      {jobs.length === 0 ? (
        <p className="ui-type-body-2 ui-type-muted">No uploads in progress.</p>
      ) : (
        <ul className="space-y-2">
          {jobs.map((job) => (
            <li className="rounded-lg border border-border bg-background/70 p-2 ui-elevation-surface" key={job.id}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="ui-type-body-2-strong truncate">{job.fileName}</p>
                  <p className="ui-type-small-1 ui-type-muted">{statusLabel(job)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className={mediaBadge({ tone: 'neutral' })}>{ext(job.fileName)}</span>
                  <span className={mediaBadge({ tone: statusTone(job) })}>{job.status}</span>
                </div>
              </div>

              <div className="mt-2">
                <div
                  aria-label={`Upload progress for ${job.fileName}: ${job.progressPercent}%`}
                  className="h-2 overflow-hidden rounded bg-muted"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={job.progressPercent}
                >
                  <div className={progressClass(job)} style={{ width: `${job.progressPercent}%` }} />
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                {isActive(job) ? (
                  <button className={mediaButton({ variant: 'outline', size: 'sm' })} onClick={() => onCancel(job.id)} type="button">
                    Cancel
                  </button>
                ) : null}
                {job.status === 'failed' ? (
                  <>
                    <button className={mediaButton({ variant: 'outline', size: 'sm' })} onClick={() => onRetry(job.id)} type="button">
                      Retry
                    </button>
                    <button className={mediaButton({ variant: 'subtle', size: 'sm' })} onClick={() => onCopyError(job.id)} type="button">
                      Copy error
                    </button>
                  </>
                ) : null}
                {job.status === 'completed' || job.status === 'failed' || job.status === 'canceled' ? (
                  <button className={mediaButton({ variant: 'ghost', size: 'sm' })} onClick={() => onRemove(job.id)} type="button">
                    Remove
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function isActive(job: UploadJob): boolean {
  return job.status === 'queued' || job.status === 'uploading' || job.status === 'processing';
}

function statusLabel(job: UploadJob): string {
  if (job.status === 'failed') {
    return `Failed${job.error?.message ? `: ${job.error.message}` : ''}`;
  }
  return job.status.charAt(0).toUpperCase() + job.status.slice(1);
}

function ext(fileName: string): string {
  const parts = fileName.split('.');
  if (parts.length < 2) return 'FILE';
  return parts[parts.length - 1].toUpperCase();
}

function statusTone(job: UploadJob): 'neutral' | 'info' | 'warning' | 'success' | 'danger' {
  if (job.status === 'failed' || job.status === 'canceled') return 'danger';
  if (job.status === 'completed') return 'success';
  if (job.status === 'processing') return 'warning';
  if (job.status === 'uploading') return 'info';
  return 'neutral';
}

function progressClass(job: UploadJob): string {
  if (job.status === 'failed' || job.status === 'canceled') return 'h-full bg-destructive';
  if (job.status === 'completed') return 'h-full bg-success';
  if (job.status === 'processing') return 'h-full bg-warning';
  return 'h-full bg-info';
}
