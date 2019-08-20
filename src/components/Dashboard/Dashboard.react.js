import React, { useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import 'styles/GlobalStyle.css';

import { message, Layout, Tag, Icon, Typography, Tooltip } from 'antd';
import { useRightSidebar, useLeftSidebar } from 'hooks';

import { init, socketInit, triggerUserGuide } from 'actions';
import { COLOR_LAYOUT, GlobalStyle, COLOR } from 'styles';
import { LEFT_SIDEBAR_NAMES, USER_GUIDE, STATE_SOURCES } from 'const';
import { Icons, FlexBox } from 'components/common';

import {
  UserGuide,
  SidebarLeft,
  SidebarRight,
  AutoComplete,
  DrawerOperations,
  LoadingScreen
} from 'components';

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
  padding: 8px;

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
  maxCount: 3
});

const openWebsite = () => window.open('http://hkube.io/');
const openGithub = () => window.open('https://github.com/kube-HPC/hkube');
const appVersion = `${process.env.REACT_APP_VERSION}v`;

function Dashboard() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(init());
    dispatch(socketInit());
  }, [dispatch]);

  const {
    selector: tableSelector,
    value: [tableValue, setTableValue],
    isCollapsed: [leftIsCollapsed, setLeftIsCollapsed]
  } = useLeftSidebar();

  const {
    selector: operationSelector,
    value: [drawerValue],
    isCollapsed: [drawerIsVisible, setDrawerIsVisible],
    onSelect: onSelectDrawer,
    menus: { menuBottomRightItems, menuItems }
  } = useRightSidebar();

  const setLeftValue = useCallback(setTableValue, [setTableValue]);
  const leftSelectedKeys = useMemo(() => [tableValue], [tableValue]);

  const onGuideClick = useCallback(() => {
    dispatch(triggerUserGuide());
    setTableValue(LEFT_SIDEBAR_NAMES.JOBS);
    setLeftIsCollapsed(true);
  }, [dispatch, setLeftIsCollapsed, setTableValue]);

  const triggerLeftVisible = useCallback(() => setLeftIsCollapsed(prev => !prev), [
    setLeftIsCollapsed
  ]);
  const toggleDrawerVisible = useCallback(() => setDrawerIsVisible(p => !p), [setDrawerIsVisible]);

  const { isDataAvailable, isSocketConnected } = useSelector(
    state => state[STATE_SOURCES.CONNECTION_STATUS]
  );

  return (
    <>
      <GlobalStyle />
      <UserGuide triggerLeftVisible={triggerLeftVisible} setLeftValue={setLeftValue} />
      {!isDataAvailable && <LoadingScreen />}
      <LayoutFullHeight>
        <SidebarLeft
          className={USER_GUIDE.SIDEBAR_LEFT}
          selectedKeys={leftSelectedKeys}
          onSelect={setLeftValue}
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
              <SidebarRight
                className={USER_GUIDE.SIDEBAR_TOP_RIGHT}
                onSelect={onSelectDrawer}
                menuItems={menuItems}
              />
              <SidebarRight
                className={USER_GUIDE.SIDEBAR_BOTTOM_RIGHT}
                onSelect={onSelectDrawer}
                menuItems={menuBottomRightItems}
              />
            </RightSidebarsFlex>
            <DrawerOperations
              visible={drawerIsVisible}
              onClose={toggleDrawerVisible}
              operation={drawerValue}
            >
              {operationSelector[drawerValue]}
            </DrawerOperations>
          </LayoutFullHeight>
        </Layout>
      </LayoutFullHeight>
    </>
  );
}

export default Dashboard;
