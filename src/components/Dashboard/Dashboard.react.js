import { Layout, message } from 'antd';
import { LoadingScreen, SidebarLeft, SidebarRight, UserGuide } from 'components';
import { USER_GUIDE, STATE_SOURCES } from 'const';
import { useActions, useConnectionStatus, useLeftSidebar } from 'hooks';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { COLOR, COLOR_LAYOUT, GlobalStyle } from 'styles';
import DashboardDrawer from './Drawer/DashboardDrawer.react';
import Header from './Header/Header.react';
import { useSelector } from 'react-redux';
import GridView from 'components/GridView/GridView.react';

const LayoutFullHeight = styled(Layout)`
  height: 100vh;
  background: white;
`;

const ContentMargin = styled(Layout.Content)`
  padding: 10px;
  ::-webkit-scrollbar {
    width: 1px;
    margin-left: 1px;
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

const Dashboard = () => {
  const { init, socketInit } = useActions();

  useEffect(() => {
    init();
    socketInit();
  }, [init, socketInit]);

  const { isDataAvailable } = useConnectionStatus();
  const {
    selector,
    value: [tableValue],
  } = useLeftSidebar();

  const { isTableView } = useSelector(state => state[STATE_SOURCES.VIEW_TYPE]);

  return (
    <>
      <GlobalStyle />
      {isDataAvailable ? (
        <>
          <UserGuide />
          <DashboardDrawer />
          <LayoutFullHeight>
            <SidebarLeft className={USER_GUIDE.SIDEBAR_LEFT} />
            <Layout>
              <Header />
              <LayoutFullHeight>
                <ContentMargin>{!isTableView ? selector[tableValue] : <GridView />}</ContentMargin>
                <RightContainer>
                  <SidebarRight className={USER_GUIDE.SIDEBAR_TOP_RIGHT} isTop />
                  <SidebarRight className={USER_GUIDE.SIDEBAR_BOTTOM_RIGHT} />
                </RightContainer>
              </LayoutFullHeight>
            </Layout>
          </LayoutFullHeight>
        </>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
};

export default Dashboard;
