import React from 'react';
import styled from 'styled-components';
import { Route } from 'react-router-dom';
import { useLeftSidebar } from 'hooks';
import { FlexBox, Icons } from 'components/common';
import { USER_GUIDE } from 'const';
import { COLOR_LAYOUT } from 'styles';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import AutoComplete from './AutoComplete';
import ExperimentPicker from './ExperimentPicker.react';
import HelpBar from './HelpBar.react';

// DO NOT REMOVE! This is important to preload the monaco instance into the global window!!!
// eslint-disable-next-line
import * as monaco from 'monaco-editor';
import ViewType from './ViewType.react';

const Container = styled(FlexBox)`
  padding: 1em 2ch;
  background: white;
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

  return (
    <Container className={USER_GUIDE.WELCOME}>
      <ButtonsContainer>
        <Icons.Hover
          type={isCollapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          onClick={toggle}
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
