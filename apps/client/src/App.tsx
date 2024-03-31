import { useMemo } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { Auth } from './auth/Auth';
import { Root } from './auth/components/Root';
import { useUserStore } from './stores/userStore';
import { HomePage } from './components/Home';

function App() {
  const user = useUserStore(({ user }) => user);
  const router = useMemo(() => {
    return createBrowserRouter([
      {
        path: '/',
        element: <Root />,
        children: [
          {
            index: true,
            element: user ? <HomePage /> : <Navigate to="/auth" />,
          },
          {
            path: '/auth',
            element: <Auth />,
          },
        ],
      },
    ]);
  }, [user]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
