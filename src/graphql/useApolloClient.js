import React, { useState } from 'react';
import {
  createHttpLink,
  ApolloClient,
  ApolloLink,
  useReactiveVar,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { selectors } from 'reducers';
import { useSelector } from 'react-redux';
import cache, { numberErrorGraphQLVar } from 'cache';
import { Modal } from 'antd';
import { GrafanaLink } from 'components';
import KeycloakServices from 'keycloak/keycloakServices';

const MAX_ERRORS_THRESHOLD = 5;
const TIME_INTERVAL = 60000;

const useApolloClient = () => {
  let errorCount = 0;
  let timer = null;
  const [isNotificationErrorShow, setIsNotificationErrorShow] = useState(false);
  const { backendApiUrl } = useSelector(selectors.config);
  const { keycloakEnable } = useSelector(selectors.connection);

  const numberErrorGraphQL = useReactiveVar(numberErrorGraphQLVar);

  const [modal, contextHolder] = Modal.useModal();

  const openNotification = () => {
    modal.error({
      title: `Oops... Something went wrong`,
      content: (
        <>
          To see more details about the system status you can access Grafana,
          please click on <GrafanaLink />
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

  const errorLink = onError(
    ({ graphQLErrors, networkError, response, operation }) => {
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
        console.error('GraphQL Errors:', graphQLErrors);
      }

      if (networkError) {
        console.error('Network Error:', networkError);
      }

      if (
        keycloakEnable &&
        response?.errors?.some(error => error.message === 'Unauthorized')
      ) {
        KeycloakServices.updateToken(30, () => {
          const newToken = KeycloakServices.getToken();
          operation.setContext({
            headers: {
              ...operation.getContext().headers,
              Authorization: `Bearer ${newToken}`,
            },
          });
        })
          .then(() => operation.retry())
          .catch(error => {
            console.error('Failed to refresh token', error);
            KeycloakServices.doLogout();
            openNotification();
          });
      }
    }
  );

  const httpLink = createHttpLink({
    uri: `${backendApiUrl.replace('/api/v1', '')}/graphql`,
  });

  const authLink = setContext((_, { headers }) => {
    if (!keycloakEnable) {
      return { headers };
    }
    const token = KeycloakServices.getToken();
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  const link = keycloakEnable
    ? ApolloLink.from([authLink, errorLink, httpLink])
    : ApolloLink.from([errorLink, httpLink]);

  const apolloClient = new ApolloClient({
    link,
    cache,
  });

  return {
    apolloClient,
    openNotification,
    contextHolderNotification: contextHolder,
    isNotificationErrorShow,
    setIsNotificationErrorShow,
  };
};

export default useApolloClient;
