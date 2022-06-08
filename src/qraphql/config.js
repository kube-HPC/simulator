import { createHttpLink, ApolloClient } from '@apollo/client';

import cache from 'cache';

const httpLink = createHttpLink({
  uri: 'https://dev1.hkube.io/hkube/api-server/graphql',
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
});
