import { z } from 'zod';
import { COMPONENTS, DOMAINS, TECHNOLOGY_AREAS, TOPICS } from '@/features/media/domain/media.constants';

/**
 * Editable asset metadata used by forms.
 */
export const assetEditableMetadataSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  creditsSource: z.string().optional(),
  license: z.string().min(1, 'License is required'),
  domain: z.enum(DOMAINS),
  topics: z.array(z.enum(TOPICS)),
  tags: z.array(z.string()),
  technologyArea: z.array(z.enum(TECHNOLOGY_AREAS)),
  component: z.array(z.enum(COMPONENTS))
});

/**
 * Type inferred from assetEditableMetadataSchema.
 */
export type AssetEditableMetadata = z.infer<typeof assetEditableMetadataSchema>;

/**
 * Partial patch variant for metadata updates.
 */
export const assetEditableMetadataPatchSchema = assetEditableMetadataSchema.partial();

/**
 * Type inferred from assetEditableMetadataPatchSchema.
 */
export type AssetEditableMetadataPatch = z.infer<typeof assetEditableMetadataPatchSchema>;
