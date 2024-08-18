import React, { useEffect, useState } from 'react';
import { ApolloProvider, useReactiveVar } from '@apollo/client';
import { selectors } from 'reducers';
import { useSelector } from 'react-redux';
import { Layout, message, FloatButton, Button } from 'antd';

import { ArrowUpOutlined } from '@ant-design/icons';
import styled, { ThemeProvider } from 'styled-components';
import { Route, Routes } from 'react-router-dom';
import { COLOR, COLOR_LAYOUT, Theme } from 'styles';
import { useActions, useCacheFilters } from 'hooks'; // useConnectionStatus
import Header from 'Routes/Base/Header';
import { instanceFiltersVar, numberErrorGraphQLVar } from 'cache';
import useApolloClient from './../graphql/useApolloClient';
import { Drawer as SiderBarRightDrawer } from './SidebarRight';
import SidebarLeft from './Base/SidebarLeft';
import UserGuide from './Base/UserGuide';
import LoadingScreen from './Base/LoadingScreen';

import LoginPage from './Base/Login/LoginPage';

import Tables from './Tables';

const LayoutFullHeight = styled(Layout)`
  height: 100vh;

  transition: all 0.5s;
  overflow: hidden;
`;

const ContentMargin = styled(Layout.Content)`
  padding: 2px 8px;
  ::-webkit-scrollbar {
    width: 1px;
  }
  ::-webkit-scrollbar-thumb {
    border: 1px solid ${COLOR.darkGrey};
  }
  /* overflow: hidden; */
`;

const RightContainer = styled.aside`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  border-left: 1px solid ${COLOR_LAYOUT.border};
`;

message.config({
  duration: 5,
  maxCount: 3,
});

const BackToTop = () => document.getElementById('globalContent');

const RoutesNav = () => {
  const { grafanaUrl } = useSelector(selectors.connection);
  const { filtersInitCacheItems } = useCacheFilters();
  const numberErrorGraphQL = useReactiveVar(numberErrorGraphQLVar);
  useEffect(() => {
    instanceFiltersVar(filtersInitCacheItems);
  }, []);

  const [isDataAvailable, setIsDataAvailable] = useState(false);
  const [isLogin] = useState(false);

  const {
    apolloClient,
    openNotification,
    contextHolderNotification,
    isNotificationErrorShow,
    setIsNotificationErrorShow,
  } = useApolloClient();
  const { socketInit } = useActions();

  useEffect(() => {
    socketInit();
    setTimeout(() => setIsDataAvailable(true), 2000);
  }, [socketInit]);

  useEffect(() => {
    if (
      !isNotificationErrorShow &&
      numberErrorGraphQL.error > 0 &&
      grafanaUrl
    ) {
      openNotification();
      setIsNotificationErrorShow(true);
    }
  }, [
    grafanaUrl,
    isNotificationErrorShow,
    numberErrorGraphQL.error,
    openNotification,
    setIsNotificationErrorShow,
  ]);

  return !isLogin ? (
    <LoginPage />
  ) : isDataAvailable ? (
    <ThemeProvider theme={{ ...Theme }}>
      <ApolloProvider client={apolloClient}>
        <UserGuide />
        <LayoutFullHeight>
          <Routes>
            <Route path="/*" element={<SidebarLeft />}>
              <Route path=":pageName" />
            </Route>
          </Routes>
          <Layout>
            <Routes>
              <Route path="/*" element={<Header />}>
                <Route path=":pageName" />
              </Route>
            </Routes>
            <LayoutFullHeight>
              <ContentMargin id="globalContent">
                {contextHolderNotification}
                <Tables />
                <FloatButton.BackTop target={BackToTop}>
                  <Button
                    style={{ opacity: '0.5' }}
                    type="primary"
                    shape="circle"
                    size="large"
                    icon={<ArrowUpOutlined />}
                  />
                </FloatButton.BackTop>
              </ContentMargin>
              <RightContainer>
                <Routes>
                  <Route
                    path="/:root/:panelType"
                    element={<SiderBarRightDrawer />}
                  />
                </Routes>
              </RightContainer>
            </LayoutFullHeight>
          </Layout>{' '}
        </LayoutFullHeight>
      </ApolloProvider>
    </ThemeProvider>
  ) : (
    <ThemeProvider theme={{ ...Theme }}>
      <LoadingScreen />
    </ThemeProvider>
  );
};
export default RoutesNav;
