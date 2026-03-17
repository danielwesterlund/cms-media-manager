import { MediaGrid } from '@/features/media/components/media-grid';
import { storyAssets } from '@/features/media/components/media-story-data';

const meta = {
  title: 'Features/Media/MediaGrid',
  component: MediaGrid,
  args: {
    assets: storyAssets,
    selectedAssetIds: [],
    loading: false,
    onToggleSelect: () => undefined,
    onOpenDetail: () => undefined
  }
};

export default meta;

export const Default = {};

export const Selected = {
  args: {
    selectedAssetIds: ['ast_img_01', 'ast_powerbi_01']
  }
};

export const Loading = {
  args: {
    loading: true
  }
};

export const Empty = {
  args: {
    assets: []
  }
};
