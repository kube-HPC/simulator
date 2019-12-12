import { Icon, Layout, message, Tag, Tooltip, Typography } from 'antd';
import { AutoComplete, LoadingScreen, SidebarLeft, SidebarRight, UserGuide } from 'components';
import { FlexBox, Icons } from 'components/common';
import { LEFT_SIDEBAR_NAMES, USER_GUIDE } from 'const';
import { useConnectionStatus, useLeftSidebar, useActions } from 'hooks';
import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { COLOR, COLOR_LAYOUT, GlobalStyle } from 'styles';
import DashboardDrawer from './DashboardDrawer.react';

const LayoutFullHeight = styled(Layout)`
  height: 100vh;
  background: white;
`;

const Header = styled.div`
  height: 64px;
  padding: 0 50px;
  line-height: 64px;
  background: white;
  border-bottom: 1pt solid ${COLOR_LAYOUT.border};
  padding-left: 10px;
  padding-right: 10px;
`;

const DarkText = styled.span`
  color: ${COLOR_LAYOUT.darkBorder};
`;

const HelpBar = styled(FlexBox)`
  > ${Icons.DarkHoverStyle}, ${DarkText} {
    margin-right: 10px;
  }
`;

const ContentMargin = styled(Layout.Content)`
  padding: 10px;

  ::-webkit-scrollbar-track {
    border: none;
    background-color: none;
  }
  ::-webkit-scrollbar {
    width: 1px;
  }
  ::-webkit-scrollbar-thumb {
    border: 1px solid ${COLOR.darkGrey};
    background-color: ${COLOR.darkGrey};
  }
`;

const RightSidebarsFlex = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  border-left: 1px solid ${COLOR_LAYOUT.border};
`;

message.config({
  duration: 5,
  maxCount: 3,
});

const openWebsite = () => window.open('http://hkube.io/');
const openGithub = () => window.open('https://github.com/kube-HPC/hkube');
const appVersion = `${process.env.REACT_APP_VERSION}v`;

const Dashboard = () => {
  const { init, socketInit, triggerUserGuide } = useActions();

  useEffect(() => {
    init();
    socketInit();
  }, [init, socketInit]);

  const {
    selector: tableSelector,
    value: [tableValue, setTableValue],
    isCollapsed: [leftIsCollapsed, setLeftIsCollapsed],
  } = useLeftSidebar();

  const onGuideClick = useCallback(() => {
    triggerUserGuide();
    setTableValue(LEFT_SIDEBAR_NAMES.JOBS);
    setLeftIsCollapsed(true);
  }, [setLeftIsCollapsed, setTableValue, triggerUserGuide]);

  const triggerLeftVisible = useCallback(() => setLeftIsCollapsed(prev => !prev), [
    setLeftIsCollapsed,
  ]);

  const { isDataAvailable, isSocketConnected } = useConnectionStatus();

  return (
    <>
      <GlobalStyle />
      {isDataAvailable ? (
        <>
          <UserGuide triggerLeftVisible={triggerLeftVisible} setLeftValue={setTableValue} />
          <DashboardDrawer />
          <LayoutFullHeight>
            <SidebarLeft
              className={USER_GUIDE.SIDEBAR_LEFT}
              selectedKeys={tableValue}
              onSelect={setTableValue}
              collapsed={!leftIsCollapsed}
            />
            <Layout>
              <Header className={USER_GUIDE.WELCOME}>
                <FlexBox>
                  <Icons.Hover
                    type={leftIsCollapsed ? 'menu-fold' : 'menu-unfold'}
                    onClick={triggerLeftVisible}
                  />
                  <AutoComplete table={tableValue} className={USER_GUIDE.HEADER.AUTO_COMPLETE} />
                  <HelpBar className={USER_GUIDE.HEADER.SOCIALS}>
                    {!isSocketConnected && (
                      <Tag color="orange">
                        <Tooltip title="Reconnecting to Socket...">
                          <FlexBox>
                            <FlexBox.Item>
                              <Typography.Text>Offline Mode</Typography.Text>
                            </FlexBox.Item>
                            <FlexBox.Item>
                              <Icon type="disconnect" />
                            </FlexBox.Item>
                          </FlexBox>
                        </Tooltip>
                      </Tag>
                    )}
                    <Icons.Hover type="global" onClick={openWebsite} />
                    <Icons.Hover type="github" onClick={openGithub} />
                    <Icons.Hover type="question-circle" onClick={onGuideClick} />
                    <DarkText>{appVersion}</DarkText>
                  </HelpBar>
                </FlexBox>
              </Header>
              <LayoutFullHeight>
                <ContentMargin>{tableSelector[tableValue]}</ContentMargin>
                <RightSidebarsFlex>
                  <SidebarRight className={USER_GUIDE.SIDEBAR_TOP_RIGHT} isTop />
                  <SidebarRight className={USER_GUIDE.SIDEBAR_BOTTOM_RIGHT} />
                </RightSidebarsFlex>
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
