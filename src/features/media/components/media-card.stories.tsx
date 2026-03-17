import { MediaCard } from '@/features/media/components/media-card';
import { storyAssets } from '@/features/media/components/media-story-data';

const meta = {
  title: 'Features/Media/MediaCard',
  component: MediaCard,
  args: {
    onToggleSelect: () => undefined,
    onOpenDetail: () => undefined
  }
};

export default meta;

export const Image = {
  args: {
    asset: storyAssets[0],
    selected: false
  }
};

export const SelectedPdf = {
  args: {
    asset: storyAssets[1],
    selected: true
  }
};

export const Audio = {
  args: {
    asset: storyAssets[5],
    selected: false
  }
};
