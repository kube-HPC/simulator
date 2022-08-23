import { createHttpLink, ApolloClient } from '@apollo/client';

import cache from 'cache';

const httpLink = createHttpLink({
  uri: `https://${process.env.REACT_APP_BACKEND_HOST}/hkube/api-server/graphql`,
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
});
