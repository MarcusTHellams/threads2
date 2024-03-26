import { Container } from '@chakra-ui/react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../../components/Header';

export const Root = () => {
	const { pathname } = useLocation();

	return (
		<>
			<Container
				maxW={pathname === '/' ? { base: '620px', md: '900px' } : '620px'}
			>
				<Header />
				<Outlet />
			</Container>
		</>
	);
};
