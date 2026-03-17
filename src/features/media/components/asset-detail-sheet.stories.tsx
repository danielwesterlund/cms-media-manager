import { AssetDetailSheet } from '@/features/media/components/asset-detail-sheet';
import { storyAssets } from '@/features/media/components/media-story-data';
import type { UsageSummary } from '@/features/media/domain/media.types';

const usage: UsageSummary = {
  assetId: storyAssets[0].id,
  placements: { draft: 2, published: 6, total: 8 },
  projects: { draft: 1, published: 3, total: 4 },
  campaigns: { draft: 3, published: 2, total: 5 },
  total: { draft: 6, published: 11, total: 17 }
};

const populatedAsset = {
  ...storyAssets[0],
  creditsSource: 'OEM field validation program',
  license: 'CC-BY',
  domain: 'SDV',
  topics: ['ADAS System', 'Telematics System'],
  tags: ['telematics', 'autonomy', 'oem'],
  technologyArea: ['Autonomous Driving Stack', 'Data & Analytics Platform'],
  component: ['Report', 'Article'],
  legacySystem: 'Connect' as const,
  legacyUrl: 'https://legacy.example.test/Connect/sdv/program-intelligence/adas-validation-report.pdf'
};

const meta = {
  title: 'Features/Media/AssetDetailSheet',
  component: AssetDetailSheet,
  args: {
    asset: populatedAsset,
    usage,
    saving: false,
    onClose: () => undefined,
    onSave: () => undefined
  }
};

export default meta;

export const FullyPopulated = {};
