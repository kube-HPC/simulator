/* eslint-disable */
import 'core-js/features/array';
import { ErrorBoundary } from 'components';
import React, { useEffect } from 'react';
import { render } from 'react-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import { ReusableProvider } from 'reusable';
import { GlobalStyle } from 'styles';
import { init } from 'actions/connection.action';
import { selectors } from 'reducers';
import mergeDeep from 'utils/deep-merge';
import _ from 'lodash';
import {
  createHttpLink,
  InMemoryCache,
  ApolloProvider,
  ApolloClient,
} from '@apollo/client';
import Root from './Routes';
import store from './store';

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        jobsAggregated: {
          keyArgs: ['type'],
          // eslint-skip-next-line
          merge(existing, incoming, { args: { cursor }, readField }) {
            // const merged = existing ? existing.slice(0) : [];
            // let offset = offsetFromCursor(merged, cursor, readField);
            // // If we couldn't find the cursor, default to appending to
            // // the end of the list, so we don't lose any data.
            // if (offset < 0) offset = merged.length;
            // // Now that we have a reliable offset, the rest of this logic
            // // is the same as in offsetLimitPagination.
            // for (let i = 0; i < incoming.jobs.length; ++i) {
            //   merged[offset + i] = incoming.jobs[i];
            // }
            // return merged;
            const merged = {
              cursor: incoming.cursor,
              jobs: mergeDeep(existing?.jobs, incoming?.jobs, true),
            };
            return merged;
          },

          // If you always want to return the whole list, you can omit
          // this read function.
          // eslint-disable-next-line
          read(
            existing,
            { args: { cursor, limit = existing?.length }, readField }
          ) {
            if (existing) {
              return {
                cursor: existing.cursor,
                jobs: Object.values(existing.jobs),
              };
            }
            return {};
          },
        },
      },
    },
  },
});

// eslint-disable-next-line
function offsetFromCursor(items, cursor, readField) {
  // Search from the back of the list because the cursor we're
  // looking for is typically the ID of the last item.
  for (let i = items.length - 1; i >= 0; --i) {
    const item = items[i];
    // Using readField works for both non-normalized objects
    // (returning item.id) and normalized references (returning
    // the id field from the referenced entity object), so it's
    // a good idea to use readField when you're not sure what
    // kind of elements you're dealing with.
    if (readField('id', item) === cursor) {
      // Add one because the cursor identifies the item just
      // before the first item in the page we care about.
      return i + 1;
    }
  }
  // Report that the cursor could not be found.
  return -1;
}

const client = new ApolloClient({
  link: httpLink,
  cache,
});

const ConfigProvider = () => {
  // do not use the useActions hook
  // ReusableProvider is not available yet at this point!
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(init());
  }, [dispatch]);

  const { hasConfig } = useSelector(selectors.config);

  return hasConfig ? (
    <Router>
      <ReusableProvider>
        <ErrorBoundary>
          <GlobalStyle />
          <Root />
        </ErrorBoundary>
      </ReusableProvider>
    </Router>
  ) : null;
};

render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <ConfigProvider />
    </Provider>
  </ApolloProvider>,
  document.getElementById('root')
);

// webpack Hot Module Replacement API
if (module.hot) {
  // keep in mind - here you are configuring HMR to accept CHILDREN MODULE
  // while `hot` would configure HMR for the CURRENT module
  module.hot.accept();
}
