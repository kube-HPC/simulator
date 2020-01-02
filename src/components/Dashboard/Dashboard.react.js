import { Layout, message } from 'antd';
import { LoadingScreen, SidebarLeft, SidebarRight, UserGuide } from 'components';
import GridView from 'components/GridView/GridView.react';
import { USER_GUIDE, LOCAL_STORAGE_KEYS } from 'const';
import {
  useActions,
  useConnectionStatus,
  useLeftSidebar,
  useLocalStorage,
  useViewType,
} from 'hooks';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { COLOR, COLOR_LAYOUT, Display, GlobalStyle } from 'styles';
import DashboardDrawer from './Drawer/DashboardDrawer.react';
import Header from './Header/Header.react';

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

  const { isTableView, loadedOnce } = useViewType();

  useLocalStorage({ value: isTableView, key: LOCAL_STORAGE_KEYS.IS_TABLE_VIEW });

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
                <Header />
                <LayoutFullHeight>
                  <ContentMargin>
                    {loadedOnce && (
                      <Display isVisible={!isTableView}>
                        <GridView />
                      </Display>
                    )}
                    <Display isVisible={isTableView}>{selector[tableValue]}</Display>
                  </ContentMargin>
                  <RightContainer>
                    <SidebarRight className={USER_GUIDE.SIDEBAR_TOP_RIGHT} isTop />
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

export default Dashboard;
