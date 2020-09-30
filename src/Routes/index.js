import React, { useEffect } from 'react';
import { Layout, message } from 'antd';
import styled from 'styled-components';
import { Route } from 'react-router-dom';
import { LOCAL_STORAGE_KEYS, USER_GUIDE } from 'const';
import { COLOR, COLOR_LAYOUT, GlobalStyle } from 'styles';
import {
  useActions,
  useConnectionStatus,
  useLocalStorage,
  useViewType,
} from 'hooks';
import Header from 'components/Header';
import SidebarRight from './Base/SidebarRight';
import SidebarLeft from './Base/SidebarLeft';
import UserGuide from './Base/UserGuide';
import LoadingScreen from './Base/LoadingScreen';
import Tables from './Tables';

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
          <Wrapper>
            <LayoutFullHeight>
              <Route path="/:pageName" component={SidebarLeft} />
              <Layout>
                <Route path="/:pageName" component={Header} />
                <LayoutFullHeight>
                  <ContentMargin>
                    <Tables />
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
