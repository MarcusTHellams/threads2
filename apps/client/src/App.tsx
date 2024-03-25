import { gql } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { api } from './common/api';
import { apolloClient } from './common/apolloClient';

function App() {
	// useEffect(() => {
	// 	api
	// 		.post<{ accessToken: string }>('/auth/signin', {
	// 			email: 'mhellams@hotmail.com',
	// 			password: 'password',
	// 		})
	// 		.then(({ data: { accessToken } }) => {
	//       console.log('accessToken: ', accessToken);
	// 			localStorage.setItem('accessToken', accessToken)
	// 		})
	// 		.catch((e) => {
	// 			console.log('e: ', e);
	// 		});
	// }, []);

	const query = gql`
		query HELLO_WORLD {
			helloWorld
		}
	`;
	const { data } = useQuery({
		queryKey: ['helloWorld'],
		async queryFn() {
			return apolloClient
				.query<{ helloWorld: string }>({
					query,
					fetchPolicy: 'no-cache',
				})
				.then(({ data: { helloWorld } }) => helloWorld);
		},
	});
	return (
		<>
			<h1>{data}</h1>
		</>
	);
}

export default App;
