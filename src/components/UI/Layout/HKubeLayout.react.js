import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import 'styles/GlobalStyle.css';

import TableAutoComplete from 'components/UI/Layout/TableAutoComplete.react';
import DrawerOperations from 'components/common/drawer/DrawerOperations.react';
import SidebarOperations from 'components/UI/Layout/SidebarRight/SidebarRight.react';
import SidebarLeft from 'components/UI/Layout/SidebarLeft/SidebarLeft.react';

import { message, Layout, Icon, Typography } from 'antd';
import { init, socketInit } from 'actions/layout.action';
import { COLOR_LAYOUT } from 'constants/colors';

import USER_GUIDE from 'constants/user-guide';
import GlobalStyle from 'styles/GlobalStyle.styles';
import UserGuide from './UserGuide/UserGuide.react';
import { triggerUserGuide } from 'actions/userGuide.action';
import { LEFT_SIDEBAR_NAMES } from 'constants/sidebar-names';

import useLeftSidebar from 'hooks/useLeftSidebar.react';
import useRightSidebar from 'hooks/useRightSidebar.react';

const LayoutFullHeight = styled(Layout)`
  height: 100vh;
  background: white;
`;

const HeaderStretch = styled(Layout.Header)`
  background: white;
  border-bottom: 1pt solid ${COLOR_LAYOUT.border};
  padding-left: 10px;
  padding-right: 10px;
`;

const RowCenter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ContentMargin = styled(Layout.Content)`
  padding: 8px;
  overflow: auto;
`;

const HoverIcon = styled(Icon)`
  color: ${COLOR_LAYOUT.darkBorder};
  :hover {
    color: black;
  }
`;

const RightSidebarsFlex = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  border-left: 1px solid ${COLOR_LAYOUT.border};
`;

const HeaderText = styled(Typography.Text)`
  color: ${COLOR_LAYOUT.darkBorder};
`;

const HelpBarFlex = styled.div`
  display: flex;
  justify-items: center;
  align-items: center;
  > ${HoverIcon}, ${HeaderText} {
    margin-left: 10px;
  }
`;

function HKubeLayout() {
  const {
    selector: tableSelector,
    value: [tableValue, setTableValue],
    isCollapsed: [leftIsCollapsed, setLeftIsCollapsed],
    toggle: toggleLeftVisible
  } = useLeftSidebar();

  const {
    selector: operationSelector,
    value: [drawerValue],
    isCollapsed: [drawerIsVisible],
    onSelect: onSelectDrawer,
    toggle: toggleDrawerVisible,
    menus: { menuBottomRightItems, menuItems }
  } = useRightSidebar();

  const dispatch = useDispatch();

  useEffect(
    () => {
      dispatch(init());
      dispatch(socketInit());
      message.config({
        duration: 5,
        maxCount: 3
      });
    },
    [dispatch]
  );

  return (
    <>
      <GlobalStyle />
      <UserGuide
        triggerLeftVisible={toggleLeftVisible}
        setLeftValue={setTableValue}
      />
      <LayoutFullHeight>
        <SidebarLeft
          className={USER_GUIDE.SIDEBAR_LEFT}
          selectedKeys={[tableValue]}
          onSelect={setTableValue}
          collapsed={!leftIsCollapsed}
        />
        <Layout>
          <HeaderStretch>
            <RowCenter type="flex" justify="space-between">
              <HoverIcon
                className={USER_GUIDE.SIDEBAR_LEFT_MENU_BUTTON}
                type={leftIsCollapsed ? 'menu-fold' : 'menu-unfold'}
                style={{ fontSize: 22 }}
                onClick={toggleLeftVisible}
              />
              <TableAutoComplete table={tableValue} />
              <HelpBarFlex>
                <HoverIcon
                  type="global"
                  style={{ fontSize: 22 }}
                  onClick={() => window.open('http://hkube.io/')}
                />
                <HoverIcon
                  type="github"
                  style={{ fontSize: 22 }}
                  onClick={() =>
                    window.open('https://github.com/kube-HPC/hkube')
                  }
                />
                <HoverIcon
                  className={USER_GUIDE.WELCOME}
                  type="question-circle"
                  style={{ fontSize: 22 }}
                  onClick={() => {
                    dispatch(triggerUserGuide());
                    setTableValue(LEFT_SIDEBAR_NAMES.JOBS);
                    setLeftIsCollapsed(true);
                  }}
                />
                <HeaderText>{`${process.env.REACT_APP_VERSION}v`}</HeaderText>
              </HelpBarFlex>
            </RowCenter>
          </HeaderStretch>
          <LayoutFullHeight>
            <ContentMargin>{tableSelector[tableValue]}</ContentMargin>
            <RightSidebarsFlex>
              <SidebarOperations
                className={USER_GUIDE.SIDEBAR_TOP_RIGHT}
                onSelect={onSelectDrawer}
                menuItems={menuItems}
              />
              <SidebarOperations
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

export default HKubeLayout;
