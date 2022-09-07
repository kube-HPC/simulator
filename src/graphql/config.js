import { createHttpLink, ApolloClient } from '@apollo/client';
import cache from 'cache';
import store from './../store';

const state = store.getState();

const httpLink = createHttpLink({
  uri: `${state.config.backendApiUrl}/graphql`,
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
});
