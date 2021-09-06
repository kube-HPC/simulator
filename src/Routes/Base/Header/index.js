import React, { useState } from 'react';
import styled from 'styled-components';
import { Route } from 'react-router-dom';
import { useLeftSidebar } from 'hooks';
import { FlexBox, Icons } from 'components/common';
import { USER_GUIDE } from 'const';
import { COLOR_LAYOUT } from 'styles';
import { FilterOutlined } from '@ant-design/icons';
import { filterToggeledVar } from 'cache';
import { Badge } from 'antd4';
// DO NOT REMOVE! This is important to preload the monaco instance into the global window!!!
// eslint-disable-next-line
import * as monaco from 'monaco-editor';
import HelpBar from './HelpBar.react';
import ExperimentPicker from './ExperimentPicker.react';
import AutoComplete from './AutoComplete';
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

const FilterButton = () => {
  const [isFilterToggeled, setIsFilterToggeledColor] = useState(false);
  const _color = isFilterToggeled ? '#2db7f5' : COLOR_LAYOUT.darkBorder;
  return (
    <Badge dot>
      <FilterOutlined
        style={{ fontSize: '24px', color: _color }}
        onClick={() => {
          filterToggeledVar(!filterToggeledVar());
          setIsFilterToggeledColor(!isFilterToggeled);
        }}
      />
    </Badge>
  );
};

const Header = () => {
  const { toggle, isCollapsed } = useLeftSidebar();
  return (
    <Container className={USER_GUIDE.WELCOME}>
      <ButtonsContainer>
        <Icons.Hover
          type={isCollapsed ? `menu-fold` : `menu-unfold`}
          onClick={toggle}
        />
        <Route exact path="/jobs" component={ViewType} />
        <Route exact path="/jobs" component={FilterButton} />
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
