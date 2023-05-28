import React from 'react';
import {
  createHttpLink,
  ApolloClient,
  ApolloLink,
  useReactiveVar,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { selectors } from 'reducers';
import { useSelector } from 'react-redux';
import cache, { numberErrorGraphQLVar } from 'cache';
import { notification } from 'antd';
import { GrafanaLink } from 'components';

const MAX_ERRORS_THRESHOLD = 5; // Maximum number of errors allowed within the time interval
const TIME_INTERVAL = 60000; // 10 seconds in milliseconds

const useApolloClient = () => {
  let errorCount = 0;
  let timer = null;

  const { backendApiUrl } = useSelector(selectors.config);
  const numberErrorGraphQL = useReactiveVar(numberErrorGraphQLVar);
  const [api, contextHolder] = notification.useNotification();

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    // Reset the timer and error count for each new error
    clearTimeout(timer);
    errorCount += 1;

    timer = setTimeout(() => {
      errorCount = 0; // Reset error count after the time interval
      numberErrorGraphQLVar({ error: 0 });
    }, TIME_INTERVAL);

    if (errorCount >= MAX_ERRORS_THRESHOLD) {
      // Return true or execute your desired logic when the error threshold is exceeded
      console.log('Too many errors within the time interval');
      numberErrorGraphQLVar({ error: numberErrorGraphQL.error + 1 });
    }

    if (graphQLErrors) {
      // Handle GraphQL errors
    }

    if (networkError) {
      // Handle network errors
    }
    /*
    const dateNow = new Date();
    const seconds = (dateNow.getTime() - numberErrorGraphQL.time.getTime()) / 1000;
    console.log("time 1",dateNow.getTime(),numberErrorGraphQL.time.getTime())
    console.log("numberErrorGraphQL 1",numberErrorGraphQL)
    console.log(`seconds :`,seconds)

    if (graphQLErrors) {
      console.log("Handle GraphQL errors graphQLErrors");

      if(seconds<10)
      {
        numberErrorGraphQLVar({error:numberErrorGraphQL.error + 1 ,time:new Date()});
      }
      else
      {
        numberErrorGraphQLVar({error:0 ,time:0});
      }
    }
  
    if (networkError) {
      if(seconds<10)
      {
        numberErrorGraphQLVar({error:numberErrorGraphQL.error + 1 ,time:new Date()});
      }
      else
      {
        numberErrorGraphQLVar({error:0 ,time:0});
      }
    }
    */
  });

  const httpLink = createHttpLink({
    uri: `${backendApiUrl.replace('/api/v1', '')}/graphql`,
  });

  const apolloClient = new ApolloClient({
    link: ApolloLink.from([errorLink, httpLink]),
    cache,
  });

  const openNotification = () => {
    api.info({
      message: `Oops... Something went wrong `,
      description: (
        <>
          {' '}
          To see more details about the system status you can access click on{' '}
          <GrafanaLink />{' '}
        </>
      ),
    });
  };

  return {
    apolloClient,
    openNotification,
    contextHolderNotification: contextHolder,
  };
};
export default useApolloClient;
