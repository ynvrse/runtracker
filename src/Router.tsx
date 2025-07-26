import { createBrowserRouter } from 'react-router-dom';

import RunTrackingPage from './features/run-tracking/RunTrackingPage';
import NotFoundPage from './pages/404';
import HomePage from './pages/Home';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <HomePage />,
    },
    {
      path: '/tracking',
      element: <RunTrackingPage />,
    },
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ],
  {
    basename: global.basename,
  },
);
