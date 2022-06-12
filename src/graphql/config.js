import { createHttpLink, ApolloClient } from '@apollo/client';

import cache from 'cache';

const httpLink = createHttpLink({
  uri: 'https://test.hkube.io/hkube/api-server/graphql',
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
});
