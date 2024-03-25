import {
  ApolloClient,
  HttpLink,
  ApolloLink,
  InMemoryCache,
  concat,
} from '@apollo/client';
import { api } from './api';
import { TokenRefreshLink } from 'apollo-link-token-refresh';

const httpLink = new HttpLink({ uri: `${window.location.origin}/graphql` });

const tokenRefreshLink = new TokenRefreshLink({
  async fetchAccessToken() {
    return api.get('/auth/refresh').then((resp) => resp.data);
  },
  accessTokenField: 'accessToken',
  handleFetch(accesstoken) {
    console.log('accesstoken: ', accesstoken);
  },
  handleResponse(operation, token) {
    return { token };
  },
  async isTokenValidOrUndefined() {
    return false;
  },
});

const authMiddleware = new ApolloLink((operation, forward) => {
  (async () => {
    const { data } = await api.get('/auth/refresh');
    console.log('data: ', data);
  })();
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: localStorage.getItem('accessToken') || null,
    },
  }));

  return forward(operation);
});

// const authMiddleware = new ApolloLink((operation, forward) => {
//   // add the authorization to the headers
//   operation.setContext(({ headers = {} }) => ({
//     headers: {
//       ...headers,
//       authorization: `Bearer ${localStorage.getItem('accessToken') || null}`,
//     },
//   }));

//   return forward(operation).map((response) => {
//     console.log('response.errors: ', response.errors);

//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     // @ts-expect-error
//     if (response?.errors?.[0]?.extensions?.originalError?.statusCode === 401) {
//       (async () => {
//         const refreshToken = localStorage.getItem('refreshToken');
//         const {
//           data: { accessToken },
//         } = await api.get<{
//           accessToken: string;
//           refreshToken: string;
//         }>('/auth/refresh', {
//           headers: {
//             setAuthorization: `Bearer ${refreshToken}`,
//           },
//         });
//         localStorage.setItem('refreshToken')
//       })();
//     }
//     return response;
//   });
// });

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: authMiddleware.concat(httpLink),
});
