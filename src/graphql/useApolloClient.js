import React, { useState } from 'react';
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
import { Modal } from 'antd';
import { GrafanaLink } from 'components';

const MAX_ERRORS_THRESHOLD = 5; // Maximum number of errors allowed within the time interval
const TIME_INTERVAL = 60000; // 60 seconds in milliseconds

const useApolloClient = () => {
  let errorCount = 0;
  let timer = null;
  const [isNotificationErrorShow, setIsNotificationErrorShow] = useState(false);
  const { backendApiUrl } = useSelector(selectors.config);
  const numberErrorGraphQL = useReactiveVar(numberErrorGraphQLVar);

  const [modal, contextHolder] = Modal.useModal();
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    clearTimeout(timer);
    errorCount += 1;

    timer = setTimeout(() => {
      errorCount = 0;
      numberErrorGraphQLVar({ error: 0 });
    }, TIME_INTERVAL);

    if (
      errorCount >= MAX_ERRORS_THRESHOLD &&
      numberErrorGraphQL.error < MAX_ERRORS_THRESHOLD
    ) {
      console.log(`Too many errors within the time interval`);
      numberErrorGraphQLVar({ error: numberErrorGraphQL.error + 1 });
    }

    if (graphQLErrors) {
      // Handle GraphQL errors
    }

    if (networkError) {
      // Handle network errors
    }
  });

  const httpLink = createHttpLink({
    uri: `${backendApiUrl.replace('/api/v1', '')}/graphql`,
  });

  const apolloClient = new ApolloClient({
    link: ApolloLink.from([errorLink, httpLink]),
    cache,
  });

  const openNotification = () => {
    modal.error({
      title: `Oops... Something went wrong `,
      content: (
        <>
          To see more details about the system status you can access
          grafana,please click on <GrafanaLink />
        </>
      ),
      width: 500,
      okText: 'Close',
      okType: 'default',

      onOk() {
        numberErrorGraphQLVar({ error: 0 });
        setTimeout(() => {
          setIsNotificationErrorShow(false);
        }, 7000);
      },
    });
  };

  return {
    apolloClient,
    openNotification,
    contextHolderNotification: contextHolder,
    isNotificationErrorShow,
    setIsNotificationErrorShow,
  };
};
export default useApolloClient;
