import {
	ApolloClient,
	HttpLink,
	InMemoryCache,
	fromPromise,
} from '@apollo/client';

import { onError } from '@apollo/client/link/error';

import { api } from './api';

const ACCESS_TOKEN = 'accessToken';

const httpLink = new HttpLink({
  uri: `${window.location.origin}/graphql`,
	headers: {
		authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
	},
});

// Define your token refresh function
const getNewToken = async () => {
	return api.get('/auth/refresh').then((response) => {
		// Extract your accessToken from the response data and return it
		const { accessToken } = response.data;
		return accessToken;
	});
};

// Set up the onError link
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
	if (graphQLErrors) {
		for (const err of graphQLErrors) {
			switch (err.extensions.code) {
				case 'UNAUTHENTICATED':
					return fromPromise(
						getNewToken().catch(() => {
							localStorage.removeItem(ACCESS_TOKEN);
						})
					)
						.filter((value) => Boolean(value))
						.flatMap((accessToken) => {
							localStorage.setItem('accessToken', accessToken);
							operation.setContext(({ headers = {} }) => ({
								headers: {
									...headers,
									authorization: `Bearer ${accessToken}`,
								},
							}));
							return forward(operation);
						});
			}
		}
	}
});

export const apolloClient = new ApolloClient({
	cache: new InMemoryCache(),
	link: errorLink.concat(httpLink),
});
