import { MediaList } from '@/features/media/components/media-list';
import { storyAssets } from '@/features/media/components/media-story-data';

const meta = {
  title: 'Features/Media/MediaList',
  component: MediaList,
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
    selectedAssetIds: ['ast_pdf_01', 'ast_audio_01']
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
