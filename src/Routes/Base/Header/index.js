import React from 'react';
import styled from 'styled-components';
import { Route } from 'react-router-dom';
import { useLeftSidebar, useSiteDarkMode } from 'hooks';
import { FlexBox, Icons } from 'components/common';
import { USER_GUIDE } from 'const';
import { COLOR_LAYOUT } from 'styles';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { ReactComponent as IconSun } from 'images/sun-icon.svg';
import { ReactComponent as IconMoon } from 'images/moon-icon.svg';
import AutoComplete from './AutoComplete';
import ExperimentPicker from './ExperimentPicker.react';
import HelpBar from './HelpBar.react';

// DO NOT REMOVE! This is important to preload the monaco instance into the global window!!!
// eslint-disable-next-line
import * as monaco from 'monaco-editor';
import ViewType from './ViewType.react';

const Container = styled(FlexBox)`
  padding: 1em 2ch;

  border-bottom: 1px solid ${COLOR_LAYOUT.border};
`;

const { Item } = FlexBox;

const Grow = styled(Item)`
  flex-grow: 1;
`;

const ButtonsContainer = styled(FlexBox.Auto)`
  padding: 0 1ch;
`;

const MiddleContainer = styled(FlexBox)`
  white-space: nowrap;
  flex-basis: 30%;
  min-width: 60ch;
`;

const Header = () => {
  const { toggle, isCollapsed } = useLeftSidebar();
  const { toggleTheme, isDarkMode } = useSiteDarkMode();

  return (
    <Container className={USER_GUIDE.WELCOME}>
      <ButtonsContainer>
        <Icons.Hover
          type={isCollapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          onClick={toggle}
        />
        <Icons.Hover
          type={
            <span
              role="img"
              aria-label="menu-unfold"
              className="anticon anticon-menu-unfold">
              {isDarkMode ? <IconSun /> : <IconMoon />}
            </span>
          }
          onClick={toggleTheme}
        />

        <Route exact path="/jobs" component={ViewType} />
      </ButtonsContainer>
      <MiddleContainer>
        <ExperimentPicker />
        <Grow>
          <AutoComplete className={USER_GUIDE.HEADER.AUTO_COMPLETE} />
        </Grow>
      </MiddleContainer>
      <HelpBar />
    </Container>
  );
};

export default Header;
