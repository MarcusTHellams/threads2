import { useMemo } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider
} from 'react-router-dom';
import { Auth } from './auth/Auth';
import { Root } from './auth/components/Root';
import { useUserStore } from './stores/userStore';

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
						element: user ? <h1>Hello World</h1> : <Navigate to="/auth" />,
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
