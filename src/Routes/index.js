import React, { useEffect } from 'react';
import { Layout, message, BackTop } from 'antd';

import styled, { ThemeProvider } from 'styled-components';
import { Route } from 'react-router-dom';
import { COLOR, COLOR_LAYOUT, Theme } from 'styles';
import { useActions, useConnectionStatus } from 'hooks';
import Header from 'Routes/Base/Header';
import { ReactComponent as IconBackUp } from 'images/backUp.svg';
import SidebarRight, { Drawer as SiderBarRightDrawer } from './SidebarRight';
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

const Routes = () => {
  const { socketInit } = useActions();

  useEffect(() => {
    socketInit();
  }, [socketInit]);

  const { isDataAvailable } = useConnectionStatus();

  return isDataAvailable ? (
    <ThemeProvider theme={{ ...Theme }}>
      <UserGuide />
      <LayoutFullHeight>
        <Route path="/:pageName" component={SidebarLeft} />
        <Layout>
          <Route path="/:pageName" component={Header} />
          <LayoutFullHeight>
            <ContentMargin id="globalContent">
              <Tables />
              <BackTop target={BackToTop}>
                <IconBackUp />
              </BackTop>
            </ContentMargin>
            <RightContainer>
              <Route path="/:root" component={SidebarRight} />
              <Route
                exact
                path="/:root/:panelType"
                component={SiderBarRightDrawer}
              />
            </RightContainer>
          </LayoutFullHeight>
        </Layout>
      </LayoutFullHeight>
    </ThemeProvider>
  ) : (
    <ThemeProvider theme={{ ...Theme }}>
      <LoadingScreen />
    </ThemeProvider>
  );
};
export default Routes;
