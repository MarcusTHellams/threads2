import { createBrowserRouter } from 'react-router-dom';
import { Auth } from '../auth/Auth';
import App from '../App';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/auth',
        element: <Auth />
      }
    ]
  },
]);
