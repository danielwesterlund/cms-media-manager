import { createBrowserRouter } from 'react-router-dom';

import { HomePage } from '@/pages/home/home-page';
import { MediaLibraryPage } from '@/pages/media/media-library-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/media',
    element: <MediaLibraryPage />
  }
]);
