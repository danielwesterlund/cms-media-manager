import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { NotificationToaster } from '@/components/ui/notification';

import { MediaLibraryPage } from '@/pages/media/media-library-page';

describe('media flow integration', () => {
  it('selects asset, opens detail, saves metadata, and shows toast', async () => {
    const user = userEvent.setup();

    const router = createMemoryRouter([{ path: '/media', element: <MediaLibraryPage /> }], {
      initialEntries: ['/media']
    });

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <NotificationToaster />
      </QueryClientProvider>
    );

    const cards = await screen.findAllByRole('checkbox');
    const firstCard = cards[0];

    await user.click(firstCard);
    await user.keyboard('{Enter}');

    const titleInput = await screen.findByLabelText('Title');
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Integration Title');
    await user.click(screen.getByRole('button', { name: /save metadata/i }));

    expect(await screen.findByText('Asset metadata saved.')).toBeInTheDocument();
  });
});
