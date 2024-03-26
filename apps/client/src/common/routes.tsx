import { createBrowserRouter } from 'react-router-dom';
import { Auth } from '../auth/Auth';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Auth />,
  },
]);
