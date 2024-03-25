import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ApolloProvider } from '@apollo/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { apolloClient } from './common/apolloClient.ts';

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
		<ApolloProvider client={apolloClient}>
			<QueryClientProvider client={client}>
				<App />
			</QueryClientProvider>
		</ApolloProvider>
	</React.StrictMode>
);
