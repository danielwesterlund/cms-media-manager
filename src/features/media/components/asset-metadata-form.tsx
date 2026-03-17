import { useMemo, type ReactNode } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Tag } from '@/components/ui/tag';
import {
  assetEditableMetadataSchema,
  type AssetEditableMetadata
} from '@/features/media/domain/media.schemas';
import { COMPONENTS, DOMAINS, TECHNOLOGY_AREAS, TOPICS } from '@/features/media/domain/media.constants';
import { mediaButton } from '@/features/media/components/media-ui.variants';
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
        <Input {...register('title')} />
      </FormField>

      <FormField label="Credits/Source" error={errors.creditsSource?.message}>
        <Input {...register('creditsSource')} />
      </FormField>

      <FormField label="License" error={errors.license?.message}>
        <Select {...register('license')}>
          {KNOWN_LICENSES.map((license) => (
            <option key={license} value={license}>
              {license}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="Domain" error={errors.domain?.message}>
        <Select {...register('domain')}>
          {DOMAINS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
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
      <span className="ui-type-body-2-strong mb-1 block">{label}</span>
      {children}
      {error ? <span className="ui-type-small-1 ui-type-danger mt-1 block">{error}</span> : null}
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
          <Tag
            as="button"
            clickable
            key={option}
            onClick={(event) => {
              event.preventDefault();
              onChange(selected ? value.filter((item) => item !== option) : [...value, option]);
            }}
            tone={selected ? 'primary' : 'gray'}
          >
            {option}
          </Tag>
        );
      })}
    </div>
  );
}
