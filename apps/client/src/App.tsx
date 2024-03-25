import { useQuery, gql } from '@apollo/client';
import { useEffect } from 'react';
import { api } from './common/api';

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
	useQuery(gql`
		query HELLO_WORLD {
			helloWorld
		}
	`);
	return (
		<>
			<h1>Hello World</h1>
		</>
	);
}

export default App;
