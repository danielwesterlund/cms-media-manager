import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { UploadTray } from '@/features/media/components/upload-tray';
import type { UploadJob } from '@/features/media/domain/media.types';

function Harness() {
  const [jobs, setJobs] = useState<UploadJob[]>([
    {
      id: 'job-active',
      fileName: 'active.png',
      fileSizeBytes: 123,
      targetFolderId: null,
      status: 'uploading',
      progressPercent: 20,
      startedAt: '2026-01-01T00:00:01.000Z'
    },
    {
      id: 'job-failed',
      fileName: 'failed.pdf',
      fileSizeBytes: 456,
      targetFolderId: null,
      status: 'failed',
      progressPercent: 80,
      startedAt: '2026-01-01T00:00:02.000Z',
      error: { code: 'network-error', message: 'Upload failed', retryable: true }
    }
  ]);

  return (
    <UploadTray
      jobs={jobs}
      onCancel={(jobId) => {
        setJobs((current) => current.map((job) => (job.id === jobId ? { ...job, status: 'canceled' } : job)));
      }}
      onCopyError={(jobId) => {
        const job = jobs.find((item) => item.id === jobId);
        if (job?.error?.message) {
          void navigator.clipboard.writeText(job.error.message);
        }
      }}
      onRemove={(jobId) => {
        setJobs((current) => current.filter((job) => job.id !== jobId));
      }}
      onRetry={(jobId) => {
        setJobs((current) =>
          current.map((job) =>
            job.id === jobId ? { ...job, status: 'uploading', progressPercent: 0, error: undefined } : job
          )
        );
      }}
    />
  );
}

describe('UploadTray', () => {
  it('handles cancel transition', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull();
    expect(screen.getAllByRole('button', { name: 'Remove' }).length).toBeGreaterThan(0);
  });

  it('handles retry transition', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(screen.queryByRole('button', { name: 'Retry' })).toBeNull();
    expect(screen.getAllByRole('button', { name: 'Cancel' }).length).toBeGreaterThan(0);
  });

  it('copies error text', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText }
    });

    render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Copy error' }));

    expect(writeText).toHaveBeenCalledWith('Upload failed');
  });
});
