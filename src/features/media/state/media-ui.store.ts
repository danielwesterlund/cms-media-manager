import { create } from 'zustand';

import type { UploadJob, UploadJobStatus } from '@/features/media/domain/media.types';

export type MediaViewMode = 'grid' | 'list';
export type MediaPickerContext = 'hero' | 'thumbnail' | 'attachments' | 'inline' | 'other';

/**
 * UI-only state for the Media Manager feature.
 */
export type MediaUiState = {
  viewMode: MediaViewMode;
  activeFolderId: string | null;
  selectedAssetIds: string[];
  activeAssetId: string | null;
  isPickerOpen: boolean;
  pickerContext: MediaPickerContext;
  attachmentsSelectionOrderedIds: string[];
  filterPanelOpen: boolean;
  uploadTray: UploadJob[];
};

/**
 * UI actions for Media Manager interactions.
 */
export type MediaUiActions = {
  toggleViewMode: () => void;
  setActiveFolder: (folderId: string | null) => void;
  selectAsset: (assetId: string) => void;
  toggleAsset: (assetId: string) => void;
  clearSelection: () => void;
  selectRange: (orderedAssetIds: string[], toAssetId: string) => void;
  openAssetDetail: (assetId: string) => void;
  closeAssetDetail: () => void;
  openPicker: (context: MediaPickerContext) => void;
  closePicker: () => void;
  setAttachmentsOrderedSelection: (ids: string[]) => void;
  setFilterPanelOpen: (open: boolean) => void;
  enqueueUploads: (jobs: UploadJob[]) => void;
  updateUploadJob: (jobId: string, patch: Partial<UploadJob>) => void;
  removeUploadJob: (jobId: string) => void;
  retryUpload: (jobId: string) => void;
  cancelUpload: (jobId: string) => void;
};

/**
 * Combined state and actions for the media UI store.
 */
export type MediaUiStore = MediaUiState & MediaUiActions;

const initialState: MediaUiState = {
  viewMode: 'grid',
  activeFolderId: null,
  selectedAssetIds: [],
  activeAssetId: null,
  isPickerOpen: false,
  pickerContext: 'other',
  attachmentsSelectionOrderedIds: [],
  filterPanelOpen: false,
  uploadTray: []
};

function dedupeIds(ids: string[]): string[] {
  return [...new Set(ids)];
}

function normalizeUploadPatch(patch: Partial<UploadJob>): Partial<UploadJob> {
  if (patch.progressPercent === undefined) {
    return patch;
  }
  const progressPercent = Math.max(0, Math.min(100, patch.progressPercent));
  return { ...patch, progressPercent };
}

function getRetryStatus(status: UploadJobStatus): UploadJobStatus {
  if (status === 'failed' || status === 'canceled') {
    return 'queued';
  }
  return status;
}

export const useMediaUiStore = create<MediaUiStore>((set) => ({
  ...initialState,

  toggleViewMode: () => {
    set((state) => ({
      viewMode: state.viewMode === 'grid' ? 'list' : 'grid'
    }));
  },

  setActiveFolder: (folderId) => {
    set({ activeFolderId: folderId });
  },

  selectAsset: (assetId) => {
    set({ selectedAssetIds: [assetId] });
  },

  toggleAsset: (assetId) => {
    set((state) => {
      const hasAsset = state.selectedAssetIds.includes(assetId);
      const selectedAssetIds = hasAsset
        ? state.selectedAssetIds.filter((id) => id !== assetId)
        : [...state.selectedAssetIds, assetId];

      return { selectedAssetIds };
    });
  },

  clearSelection: () => {
    set({ selectedAssetIds: [] });
  },

  selectRange: (orderedAssetIds, toAssetId) => {
    set((state) => {
      if (orderedAssetIds.length === 0) {
        return { selectedAssetIds: [toAssetId] };
      }

      const anchorId = state.selectedAssetIds[0] ?? toAssetId;
      const anchorIndex = orderedAssetIds.indexOf(anchorId);
      const toIndex = orderedAssetIds.indexOf(toAssetId);

      if (anchorIndex < 0 || toIndex < 0) {
        return { selectedAssetIds: dedupeIds([...state.selectedAssetIds, toAssetId]) };
      }

      const start = Math.min(anchorIndex, toIndex);
      const end = Math.max(anchorIndex, toIndex);

      return {
        selectedAssetIds: orderedAssetIds.slice(start, end + 1)
      };
    });
  },

  openAssetDetail: (assetId) => {
    set({ activeAssetId: assetId });
  },

  closeAssetDetail: () => {
    set({ activeAssetId: null });
  },

  openPicker: (context) => {
    set({ isPickerOpen: true, pickerContext: context });
  },

  closePicker: () => {
    set({ isPickerOpen: false });
  },

  setAttachmentsOrderedSelection: (ids) => {
    set({ attachmentsSelectionOrderedIds: dedupeIds(ids) });
  },

  setFilterPanelOpen: (open) => {
    set({ filterPanelOpen: open });
  },

  enqueueUploads: (jobs) => {
    set((state) => ({
      uploadTray: [...state.uploadTray, ...jobs]
    }));
  },

  updateUploadJob: (jobId, patch) => {
    set((state) => ({
      uploadTray: state.uploadTray.map((job) => {
        if (job.id !== jobId) return job;
        return { ...job, ...normalizeUploadPatch(patch) };
      })
    }));
  },

  removeUploadJob: (jobId) => {
    set((state) => ({
      uploadTray: state.uploadTray.filter((job) => job.id !== jobId)
    }));
  },

  retryUpload: (jobId) => {
    set((state) => ({
      uploadTray: state.uploadTray.map((job) => {
        if (job.id !== jobId) return job;
        return {
          ...job,
          status: getRetryStatus(job.status),
          progressPercent: 0,
          error: undefined,
          completedAt: undefined
        };
      })
    }));
  },

  cancelUpload: (jobId) => {
    set((state) => ({
      uploadTray: state.uploadTray.map((job) => {
        if (job.id !== jobId) return job;
        return {
          ...job,
          status: 'canceled',
          completedAt: new Date().toISOString()
        };
      })
    }));
  }
}));

export const mediaUiSelectors = {
  viewMode: (state: MediaUiStore) => state.viewMode,
  activeFolderId: (state: MediaUiStore) => state.activeFolderId,
  selectedAssetIds: (state: MediaUiStore) => state.selectedAssetIds,
  activeAssetId: (state: MediaUiStore) => state.activeAssetId,
  isPickerOpen: (state: MediaUiStore) => state.isPickerOpen,
  pickerContext: (state: MediaUiStore) => state.pickerContext,
  attachmentsSelectionOrderedIds: (state: MediaUiStore) => state.attachmentsSelectionOrderedIds,
  filterPanelOpen: (state: MediaUiStore) => state.filterPanelOpen,
  uploadTray: (state: MediaUiStore) => state.uploadTray,
  toggleViewMode: (state: MediaUiStore) => state.toggleViewMode,
  setActiveFolder: (state: MediaUiStore) => state.setActiveFolder,
  selectAsset: (state: MediaUiStore) => state.selectAsset,
  toggleAsset: (state: MediaUiStore) => state.toggleAsset,
  clearSelection: (state: MediaUiStore) => state.clearSelection,
  selectRange: (state: MediaUiStore) => state.selectRange,
  openAssetDetail: (state: MediaUiStore) => state.openAssetDetail,
  closeAssetDetail: (state: MediaUiStore) => state.closeAssetDetail,
  openPicker: (state: MediaUiStore) => state.openPicker,
  closePicker: (state: MediaUiStore) => state.closePicker,
  setAttachmentsOrderedSelection: (state: MediaUiStore) => state.setAttachmentsOrderedSelection,
  setFilterPanelOpen: (state: MediaUiStore) => state.setFilterPanelOpen,
  enqueueUploads: (state: MediaUiStore) => state.enqueueUploads,
  updateUploadJob: (state: MediaUiStore) => state.updateUploadJob,
  removeUploadJob: (state: MediaUiStore) => state.removeUploadJob,
  retryUpload: (state: MediaUiStore) => state.retryUpload,
  cancelUpload: (state: MediaUiStore) => state.cancelUpload
};

export function useMediaUiActions(): MediaUiActions {
  return {
    toggleViewMode: useMediaUiStore(mediaUiSelectors.toggleViewMode),
    setActiveFolder: useMediaUiStore(mediaUiSelectors.setActiveFolder),
    selectAsset: useMediaUiStore(mediaUiSelectors.selectAsset),
    toggleAsset: useMediaUiStore(mediaUiSelectors.toggleAsset),
    clearSelection: useMediaUiStore(mediaUiSelectors.clearSelection),
    selectRange: useMediaUiStore(mediaUiSelectors.selectRange),
    openAssetDetail: useMediaUiStore(mediaUiSelectors.openAssetDetail),
    closeAssetDetail: useMediaUiStore(mediaUiSelectors.closeAssetDetail),
    openPicker: useMediaUiStore(mediaUiSelectors.openPicker),
    closePicker: useMediaUiStore(mediaUiSelectors.closePicker),
    setAttachmentsOrderedSelection: useMediaUiStore(mediaUiSelectors.setAttachmentsOrderedSelection),
    setFilterPanelOpen: useMediaUiStore(mediaUiSelectors.setFilterPanelOpen),
    enqueueUploads: useMediaUiStore(mediaUiSelectors.enqueueUploads),
    updateUploadJob: useMediaUiStore(mediaUiSelectors.updateUploadJob),
    removeUploadJob: useMediaUiStore(mediaUiSelectors.removeUploadJob),
    retryUpload: useMediaUiStore(mediaUiSelectors.retryUpload),
    cancelUpload: useMediaUiStore(mediaUiSelectors.cancelUpload)
  };
}
