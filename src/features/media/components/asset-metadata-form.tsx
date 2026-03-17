import { useMemo, type ReactNode } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  assetEditableMetadataSchema,
  type AssetEditableMetadata
} from '@/features/media/domain/media.schemas';
import { COMPONENTS, DOMAINS, TECHNOLOGY_AREAS, TOPICS } from '@/features/media/domain/media.constants';
import { mediaButton, mediaChip } from '@/features/media/components/media-ui.variants';
import { TagsChipInput } from '@/features/media/components/tags-chip-input';

type AssetMetadataFormProps = {
  defaultValues: AssetEditableMetadata;
  submitting?: boolean;
  onSubmit: (values: AssetEditableMetadata) => Promise<void> | void;
};

const KNOWN_LICENSES = ['Internal', 'CC-BY', 'CC-BY-SA', 'Royalty Free'] as const;

/**
 * Metadata edit form for asset details.
 */
export function AssetMetadataForm({ defaultValues, submitting = false, onSubmit }: AssetMetadataFormProps) {
  const resolver = useMemo(() => zodResolver(assetEditableMetadataSchema), []);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<AssetEditableMetadata>({
    defaultValues,
    resolver
  });

  const submit: SubmitHandler<AssetEditableMetadata> = async (values) => {
    await onSubmit(values);
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(submit)}>
      <FormField label="Title" error={errors.title?.message}>
        <input className="h-9 w-full rounded-md border border-input px-3 text-sm" {...register('title')} />
      </FormField>

      <FormField label="Credits/Source" error={errors.creditsSource?.message}>
        <input className="h-9 w-full rounded-md border border-input px-3 text-sm" {...register('creditsSource')} />
      </FormField>

      <FormField label="License" error={errors.license?.message}>
        <select className="h-9 w-full rounded-md border border-input px-3 text-sm" {...register('license')}>
          {KNOWN_LICENSES.map((license) => (
            <option key={license} value={license}>
              {license}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Domain" error={errors.domain?.message}>
        <select className="h-9 w-full rounded-md border border-input px-3 text-sm" {...register('domain')}>
          {DOMAINS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Topics">
        <Controller
          control={control}
          name="topics"
          render={({ field }) => (
            <MultiSelectChips
              onChange={field.onChange}
              options={TOPICS}
              value={field.value}
            />
          )}
        />
      </FormField>

      <Controller
        control={control}
        name="tags"
        render={({ field }) => <TagsChipInput id="asset-tags" label="Tags" onChange={field.onChange} value={field.value} />}
      />

      <FormField label="Technology Area">
        <Controller
          control={control}
          name="technologyArea"
          render={({ field }) => (
            <MultiSelectChips
              onChange={field.onChange}
              options={TECHNOLOGY_AREAS}
              value={field.value}
            />
          )}
        />
      </FormField>

      <FormField label="Component">
        <Controller
          control={control}
          name="component"
          render={({ field }) => (
            <MultiSelectChips
              onChange={field.onChange}
              options={COMPONENTS}
              value={field.value}
            />
          )}
        />
      </FormField>

      <button className={mediaButton({ variant: 'default', size: 'md' })} disabled={submitting} type="submit">
        {submitting ? 'Saving...' : 'Save metadata'}
      </button>
    </form>
  );
}

function FormField({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-destructive">{error}</span> : null}
    </label>
  );
}

function MultiSelectChips({
  value,
  options,
  onChange
}: {
  value: string[];
  options: readonly string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {options.map((option) => {
        const selected = value.includes(option);
        return (
          <button
            className={mediaChip({ tone: selected ? 'selected' : 'neutral' })}
            key={option}
            onClick={(event) => {
              event.preventDefault();
              onChange(selected ? value.filter((item) => item !== option) : [...value, option]);
            }}
            type="button"
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
