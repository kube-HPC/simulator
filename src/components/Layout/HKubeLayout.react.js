import React, { useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import 'styles/GlobalStyle.css';

import { message, Layout } from 'antd';
import USER_GUIDE from 'constants/user-guide';
import { useRightSidebar, useLeftSidebar } from 'hooks';
import {
  SidebarLeft,
  TableAutoComplete,
  DrawerOperations,
  SidebarRight,
  LoadingScreen,
  UserGuide,
  Icons
} from 'components';

import { init, socketInit, triggerUserGuide } from 'actions';
import { LEFT_SIDEBAR_NAMES } from 'constants/sidebar-names';
import { COLOR_LAYOUT, GlobalStyle, COLOR } from 'styles';

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

const FlexBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DarkText = styled.span`
  color: ${COLOR_LAYOUT.darkBorder};
`;

const HelpBar = styled(FlexBox)`
  > ${Icons.DarkHoverStyle}, ${DarkText} {
    margin-left: 10px;
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

function HKubeLayout() {
  const dispatch = useDispatch();

  useEffect(
    () => {
      dispatch(init());
      dispatch(socketInit());
    },
    [dispatch]
  );

  const {
    selector: tableSelector,
    value: [tableValue, setTableValue],
    isCollapsed: [leftIsCollapsed, setLeftIsCollapsed]
  } = useLeftSidebar();

  const triggerLeftVisible = useCallback(() => setLeftIsCollapsed(prev => !prev), [
    setLeftIsCollapsed
  ]);

  const setLeftValue = useCallback(setTableValue, [setTableValue]);
  const leftSelectedKeys = useMemo(() => [tableValue], [tableValue]);

  const onGuideClick = useCallback(
    () => {
      dispatch(triggerUserGuide());
      setTableValue(LEFT_SIDEBAR_NAMES.JOBS);
      setLeftIsCollapsed(true);
    },
    [dispatch, setLeftIsCollapsed, setTableValue]
  );

  const {
    selector: operationSelector,
    value: [drawerValue],
    isCollapsed: [drawerIsVisible, setDrawerIsVisible],
    onSelect: onSelectDrawer,
    menus: { menuBottomRightItems, menuItems }
  } = useRightSidebar();

  const toggleDrawerVisible = useCallback(() => setDrawerIsVisible(p => !p), [setDrawerIsVisible]);

  return (
    <>
      <GlobalStyle />
      <LoadingScreen />
      <UserGuide triggerLeftVisible={triggerLeftVisible} setLeftValue={setLeftValue} />
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
              <TableAutoComplete table={tableValue} className={USER_GUIDE.HEADER.AUTO_COMPLETE} />
              <HelpBar className={USER_GUIDE.HEADER.SOCIALS}>
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

export default React.memo(HKubeLayout);
