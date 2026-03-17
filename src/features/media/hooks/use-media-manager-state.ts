import { useMemo } from 'react';

export type MediaManagerViewState = {
  isLoading: boolean;
  hasAssets: boolean;
};

export function useMediaManagerState(): MediaManagerViewState {
  return useMemo(
    () => ({
      isLoading: false,
      hasAssets: false
    }),
    []
  );
}
