import { ApolloProvider } from '@apollo/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { apolloClient } from './common/apolloClient.ts';
import theme from './common/theme.ts';
import './index.css';

const client = new QueryClient({
	defaultOptions: {
		queries: {
			refetchInterval: false,
			refetchOnWindowFocus: false,
		},
	},
});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ChakraProvider>
			<ColorModeScript initialColorMode={theme.config.initialColorMode} />
			<ApolloProvider client={apolloClient}>
				<QueryClientProvider client={client}>
					<App />
				</QueryClientProvider>
			</ApolloProvider>
		</ChakraProvider>
	</React.StrictMode>
);
