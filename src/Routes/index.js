import React, { useEffect } from 'react';
import { Layout, message } from 'antd';
import styled from 'styled-components';
import { Route } from 'react-router-dom';
import {
  LoadingScreen,
  SidebarLeft,
  SidebarRight,
  UserGuide,
} from 'components';
import { LOCAL_STORAGE_KEYS, USER_GUIDE } from 'const';
import { COLOR, COLOR_LAYOUT, GlobalStyle } from 'styles';
import {
  useActions,
  useConnectionStatus,
  useLocalStorage,
  useViewType,
} from 'hooks';
import DashboardDrawer from 'components/Dashboard/Drawer';
import Header from 'components/Dashboard/Header';

import Body from './Body';

const LayoutFullHeight = styled(Layout)`
  height: 100vh;
  background: white;
`;

const Wrapper = styled.div`
  transition: all 0.5s;
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

const RightContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  border-left: 1px solid ${COLOR_LAYOUT.border};
`;

message.config({
  duration: 5,
  maxCount: 3,
});

const Routes = () => {
  const { init, socketInit } = useActions();

  useEffect(() => {
    init();
    socketInit();
  }, [init, socketInit]);

  const { isDataAvailable } = useConnectionStatus();

  const { isTableView } = useViewType();

  useLocalStorage({
    value: isTableView,
    key: LOCAL_STORAGE_KEYS.IS_TABLE_VIEW,
  });
  return (
    <>
      <GlobalStyle />
      {isDataAvailable ? (
        <>
          <UserGuide />
          <DashboardDrawer />
          <Wrapper>
            <LayoutFullHeight>
              <SidebarLeft className={USER_GUIDE.SIDEBAR_LEFT} />
              <Layout>
                <Route path="/:pageName" component={Header} />
                {/* <Header /> */}
                <LayoutFullHeight>
                  <ContentMargin>
                    {/* {loadedOnce && (
                      <Display isVisible={!isTableView}>
                        <GridView />
                      </Display>
                    )} */}
                    <Body />
                  </ContentMargin>
                  <RightContainer>
                    <SidebarRight
                      className={USER_GUIDE.SIDEBAR_TOP_RIGHT}
                      isTop
                    />
                    <SidebarRight className={USER_GUIDE.SIDEBAR_BOTTOM_RIGHT} />
                  </RightContainer>
                </LayoutFullHeight>
              </Layout>
            </LayoutFullHeight>
          </Wrapper>
        </>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
};
export default Routes;
