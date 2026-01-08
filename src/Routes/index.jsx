import React, { useEffect, useState } from 'react';
import { events } from 'utils';
import { ApolloProvider, useReactiveVar } from '@apollo/client';
import { selectors } from 'reducers';
import { useSelector } from 'react-redux';
import { Layout, message, FloatButton, Button } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import styled, { ThemeProvider } from 'styled-components';
import { Route, Routes } from 'react-router-dom';
import { COLOR, COLOR_LAYOUT, Theme } from 'styles';
import { useActions, useCacheFilters } from 'hooks';
import Header from 'Routes/Base/Header';
import { instanceFiltersVar, numberErrorGraphQLVar } from 'cache';
import useApolloClient from '../graphql/useApolloClient';
import { Drawer as SiderBarRightDrawer } from './SidebarRight';
import SidebarLeft from './Base/SidebarLeft';
import UserGuide from './Base/UserGuide';
import LoadingScreen from './Base/LoadingScreen';
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
  const [isDataAvailable, setIsDataAvailable] = useState(false);

  const { socketInit } = useActions();

  const {
    apolloClient,
    openNotification,
    contextHolderNotification,
    isNotificationErrorShow,
    setIsNotificationErrorShow,
  } = useApolloClient();

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

  useEffect(() => {
    instanceFiltersVar(filtersInitCacheItems);
  }, []);

  const [messageApi, contextHolder] = message.useMessage();
  const handleMessage = msg => {
    messageApi.open({
      type: 'info',
      content: msg,
      className: 'custom-class',
      style: {
        marginTop: '20vh',
      },
    });
  };

  useEffect(() => {
    events.on('global_alert_msg', handleMessage);
    return () => events.off('global_alert_msg', handleMessage);
  }, []);

  return isDataAvailable ? (
    <ThemeProvider theme={{ ...Theme }}>
      <ApolloProvider client={apolloClient}>
        {contextHolder}
        <UserGuide />
        <LayoutFullHeight>
          <Routes>
            <Route path="/*" element={<SidebarLeft />}>
              <Route path=":pageName" element={<> </>} />
            </Route>
          </Routes>

          <Layout>
            <Routes>
              <Route path="/*" element={<Header />}>
                <Route path=":pageName" element={<> </>} />
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
                  <Route path="*" element={<> </>} />
                </Routes>
              </RightContainer>
            </LayoutFullHeight>
          </Layout>
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
