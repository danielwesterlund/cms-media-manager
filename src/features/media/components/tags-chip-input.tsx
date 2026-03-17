import { useState, type KeyboardEvent } from 'react';
import { mediaChip } from '@/features/media/components/media-ui.variants';

type TagsChipInputProps = {
  id: string;
  label: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
};

/**
 * Free-form chips input used for tags.
 */
export function TagsChipInput({ id, label, value, onChange, placeholder = 'Add tag and press Enter' }: TagsChipInputProps) {
  const [draft, setDraft] = useState('');

  const commitTag = () => {
    const next = draft.trim();
    if (!next) return;
    if (value.includes(next)) {
      setDraft('');
      return;
    }
    onChange([...value, next]);
    setDraft('');
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      commitTag();
    }
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium" htmlFor={id}>
        {label}
      </label>
      <div className="rounded-md border border-input bg-background p-2">
        <div className="mb-2 flex flex-wrap gap-1">
          {value.map((tag) => (
            <span className={mediaChip({ tone: 'neutral' })} key={tag}>
              {tag}
              <button
                aria-label={`Remove ${tag}`}
                className="text-muted-foreground hover:text-foreground"
                onClick={() => onChange(value.filter((item) => item !== tag))}
                type="button"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          className="h-8 w-full rounded border border-input bg-background px-2 text-sm"
          id={id}
          onBlur={commitTag}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          value={draft}
        />
      </div>
    </div>
  );
}
