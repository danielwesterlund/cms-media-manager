import { UploadTray } from '@/features/media/components/upload-tray';
import type { UploadJob } from '@/features/media/domain/media.types';

const jobs: UploadJob[] = [
  {
    id: 'upl_00001',
    fileName: 'hero-image.jpg',
    fileSizeBytes: 1024,
    targetFolderId: null,
    status: 'uploading',
    progressPercent: 45,
    startedAt: '2026-01-01T00:00:01.000Z'
  },
  {
    id: 'upl_00002',
    fileName: 'quarterly-report.pdf',
    fileSizeBytes: 2048,
    targetFolderId: 'fld_brand',
    status: 'failed',
    progressPercent: 82,
    startedAt: '2026-01-01T00:00:02.000Z',
    error: {
      code: 'network-error',
      message: 'Simulated upload failure. Please retry.',
      retryable: true
    }
  },
  {
    id: 'upl_00003',
    fileName: 'podcast-intro.mp3',
    fileSizeBytes: 4096,
    targetFolderId: 'fld_audio',
    status: 'completed',
    progressPercent: 100,
    startedAt: '2026-01-01T00:00:03.000Z',
    completedAt: '2026-01-01T00:00:12.000Z'
  }
];

const meta = {
  title: 'Features/Media/UploadTray',
  component: UploadTray,
  args: {
    jobs,
    onCancel: () => undefined,
    onRetry: () => undefined,
    onRemove: () => undefined,
    onCopyError: () => undefined
  }
};

export default meta;

export const MixedStates = {};
