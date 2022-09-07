import { createHttpLink, ApolloClient } from '@apollo/client';
import { selectors } from 'reducers';
import { useSelector } from 'react-redux';
import cache from 'cache';

const useApolloClient = () => {
  const { backendApiUrl } = useSelector(selectors.config);
  const httpLink = createHttpLink({
    uri: `${backendApiUrl}/graphql`,
  });

  const apolloClient = new ApolloClient({
    link: httpLink,
    cache,
  });

  return { apolloClient };
};
export default useApolloClient;
