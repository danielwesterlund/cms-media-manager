import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import type { UploadError } from '@/features/media/domain/media.types';
import { mediaQueryKeys } from '@/features/media/hooks/media-query-keys';
import { getMediaService } from '@/features/media/services/media-service-provider';
import { mediaUiSelectors, useMediaUiActions, useMediaUiStore } from '@/features/media/state/media-ui.store';

export type UploadController = {
  startUpload: (files: File[], targetFolderId: string | null) => Promise<void>;
  cancelUpload: (jobId: string) => void;
  retryUpload: (jobId: string) => void;
  removeUpload: (jobId: string) => void;
  copyError: (jobId: string) => Promise<void>;
};

/**
 * Coordinates upload job simulation and tray state updates.
 */
export function useUploadController(): UploadController {
  const mediaService = getMediaService();
  const queryClient = useQueryClient();
  const actions = useMediaUiActions();
  const jobs = useMediaUiStore(mediaUiSelectors.uploadTray);
  const timersRef = useRef<Record<string, ReturnType<typeof setInterval>>>({});
  const attemptsRef = useRef<Record<string, number>>({});

  const stopJobTimer = (jobId: string) => {
    const timer = timersRef.current[jobId];
    if (!timer) return;
    clearInterval(timer);
    delete timersRef.current[jobId];
  };

  const startJobTimer = (jobId: string) => {
    stopJobTimer(jobId);

    timersRef.current[jobId] = setInterval(() => {
      const currentJob = useMediaUiStore.getState().uploadTray.find((job) => job.id === jobId);
      if (!currentJob) {
        stopJobTimer(jobId);
        return;
      }

      if (currentJob.status === 'canceled' || currentJob.status === 'completed' || currentJob.status === 'failed') {
        stopJobTimer(jobId);
        return;
      }

      const attempt = attemptsRef.current[jobId] ?? 1;
      const nextProgress = Math.min(100, currentJob.progressPercent + progressStep(jobId));

      if (nextProgress >= 90 && shouldFail(jobId, attempt)) {
        const error: UploadError = {
          code: 'network-error',
          message: 'Simulated upload failure. Please retry.',
          retryable: true
        };
        actions.updateUploadJob(jobId, { status: 'failed', error, progressPercent: Math.min(95, nextProgress) });
        stopJobTimer(jobId);
        return;
      }

      if (nextProgress >= 100) {
        actions.updateUploadJob(jobId, {
          status: 'completed',
          progressPercent: 100,
          completedAt: new Date().toISOString(),
          error: undefined
        });
        stopJobTimer(jobId);
        void queryClient.invalidateQueries({ queryKey: mediaQueryKeys.assetsRoot });
        void queryClient.invalidateQueries({ queryKey: mediaQueryKeys.folders });
        return;
      }

      actions.updateUploadJob(jobId, {
        status: nextProgress > 70 ? 'processing' : 'uploading',
        progressPercent: nextProgress
      });
    }, 450);
  };

  useEffect(() => {
    return () => {
      for (const timer of Object.values(timersRef.current)) {
        clearInterval(timer);
      }
      timersRef.current = {};
    };
  }, []);

  const startUpload = async (files: File[], targetFolderId: string | null) => {
    if (files.length === 0) return;

    const newJobs = await mediaService.startUpload(files, targetFolderId);
    actions.enqueueUploads(newJobs);
    void queryClient.invalidateQueries({ queryKey: mediaQueryKeys.assetsRoot });

    for (const job of newJobs) {
      attemptsRef.current[job.id] = attemptsRef.current[job.id] ?? 1;
      startJobTimer(job.id);
    }
  };

  const cancelUpload = (jobId: string) => {
    stopJobTimer(jobId);
    actions.cancelUpload(jobId);
  };

  const retryUpload = (jobId: string) => {
    attemptsRef.current[jobId] = (attemptsRef.current[jobId] ?? 1) + 1;
    actions.retryUpload(jobId);
    startJobTimer(jobId);
  };

  const removeUpload = (jobId: string) => {
    stopJobTimer(jobId);
    actions.removeUploadJob(jobId);
  };

  const copyError = async (jobId: string) => {
    const job = jobs.find((item) => item.id === jobId);
    const errorText = job?.error?.message;
    if (!errorText) return;
    await navigator.clipboard.writeText(errorText);
  };

  return { startUpload, cancelUpload, retryUpload, removeUpload, copyError };
}

function progressStep(jobId: string): number {
  return 8 + (hash(jobId) % 12);
}

function shouldFail(jobId: string, attempt: number): boolean {
  if (attempt > 1) {
    return false;
  }
  return hash(jobId) % 5 === 0;
}

function hash(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h << 5) - h + value.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}
