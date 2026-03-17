import { useState, type KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Tag } from '@/components/ui/tag';

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
      <label className="ui-type-body-2-strong mb-1 block" htmlFor={id}>
        {label}
      </label>
      <div className="rounded-md border border-input bg-background p-2">
        <div className="mb-2 flex flex-wrap gap-1">
          {value.map((tag) => (
            <Tag
              closeable
              key={tag}
              onClose={() => onChange(value.filter((item) => item !== tag))}
              tone="gray"
            >
              {tag}
            </Tag>
          ))}
        </div>
        <Input
          className="h-8 px-2"
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
