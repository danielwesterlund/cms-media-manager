import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AssetDetailSheet } from '@/features/media/components/asset-detail-sheet';
import { AssetMetadataForm } from '@/features/media/components/asset-metadata-form';
import { storyAssets } from '@/features/media/components/media-story-data';

describe('Asset metadata and detail sheet', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('requires license value', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <AssetMetadataForm
        defaultValues={{
          title: 'Asset',
          creditsSource: '',
          license: '',
          domain: 'Autonomy',
          topics: [],
          tags: [],
          technologyArea: [],
          component: []
        }}
        onSubmit={onSubmit}
      />
    );

    await user.click(screen.getByRole('button', { name: /save metadata/i }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/license is required/i)).toBeInTheDocument();
  });

  it('adds and removes tags chips', async () => {
    const user = userEvent.setup();

    render(
      <AssetMetadataForm
        defaultValues={{
          title: 'Asset',
          creditsSource: '',
          license: 'Internal',
          domain: 'Autonomy',
          topics: [],
          tags: ['hero'],
          technologyArea: [],
          component: []
        }}
        onSubmit={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText(/add tag and press enter/i);
    await user.type(input, 'featured{enter}');

    expect(screen.getByText('featured')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /remove featured/i }));
    expect(screen.queryByText('featured')).toBeNull();
  });

  it('copies legacy url using copy button', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText }
    });

    render(
      <AssetDetailSheet
        asset={{ ...storyAssets[0], legacyUrl: 'https://legacy.example.test/a1' }}
        onClose={vi.fn()}
        onSave={vi.fn()}
        usage={null}
      />
    );

    await user.click(screen.getByRole('tab', { name: /system/i }));
    await user.click(screen.getByRole('button', { name: /copy legacy url/i }));

    expect(writeText).toHaveBeenCalledWith('https://legacy.example.test/a1');
  });
});
