import { FilterPanel, type FilterPanelOptions, type MediaFilterState } from '@/features/media/components/filter-panel';
import { COMPONENTS, DOMAINS, LEGACY_SYSTEMS, TAG_SUGGESTIONS, TECHNOLOGY_AREAS, TOPICS } from '@/features/media/domain/media.constants';

const options: FilterPanelOptions = {
  fileTypes: ['image', 'pdf', 'office', 'tableau', 'powerbi', 'audio'],
  domains: [...DOMAINS],
  topics: [...TOPICS],
  licenses: ['Internal', 'CC-BY', 'CC-BY-SA', 'Royalty Free', 'Custom'],
  tags: [...TAG_SUGGESTIONS],
  technologyAreas: [...TECHNOLOGY_AREAS],
  components: [...COMPONENTS],
  legacySystems: [...LEGACY_SYSTEMS]
};

const value: MediaFilterState = {
  fileTypes: ['image', 'pdf'],
  domains: ['Autonomy'],
  topics: ['ADAS System', 'Telematics System'],
  licenses: ['Internal'],
  tags: ['telematics', 'autonomy'],
  technologyAreas: ['Autonomous Driving Stack'],
  components: ['Report'],
  legacy: true,
  legacySystems: ['Connect']
};

const meta = {
  title: 'Features/Media/FilterPanel',
  component: FilterPanel,
  args: {
    value,
    options,
    onChange: () => undefined
  }
};

export default meta;

export const MultipleActiveFilters = {};
