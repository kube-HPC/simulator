import React, { useState, useMemo } from 'react';
import { filterToggeledVar } from 'cache';
import useQueryHook from 'hooks/useQuery';
import styled from 'styled-components';
import { Route } from 'react-router-dom';
import { FlexBox, Icons } from 'components/common';
import { USER_GUIDE } from 'const';
import { COLOR_LAYOUT } from 'styles';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { useLeftSidebar } from 'hooks';

// import AutoComplete from './AutoComplete';

import HelpBar from './HelpBar.react';
import TagsFiltersViews from './TagsFiltersViews';

import ViewType from './ViewType.react';

// DO NOT REMOVE! This is important to preload the monaco instance into the global window!!!
// eslint-disable-next-line
import * as monaco from 'monaco-editor';

const Container = styled(FlexBox)`
  padding: 1em 2ch;

  border-bottom: 1px solid ${COLOR_LAYOUT.border};
`;

// const { Item } = FlexBox;

/* const Grow = styled(Item)`
  flex-grow: 1;
`; */

const ButtonsContainer = styled(FlexBox.Auto)`
  padding: 0 1ch;

  div:empty {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
`;

/* const MiddleContainer = styled(FlexBox)`
  white-space: nowrap;
  flex-basis: 30%;
  min-width: 60ch;
`; */

const FilterButton = () => {
  const query = useQueryHook();

  const showFilterByProp = useMemo(() => query.get('view') === 'grid', [query]);
  const [isFilterToggeled, setIsFilterToggeledColor] = useState(false);
  const _color = !isFilterToggeled ? '#2db7f5' : COLOR_LAYOUT.darkBorder;
  return (
    !showFilterByProp && (
      <FilterOutlined
        title="Filter"
        style={{ fontSize: '24px', color: _color }}
        onClick={() => {
          filterToggeledVar(!filterToggeledVar());
          setIsFilterToggeledColor(!isFilterToggeled);
        }}
      />
    )
  );
};

const Header = () => {
  const { toggle, isCollapsed } = useLeftSidebar();

  return (
    <Container className={USER_GUIDE.WELCOME}>
      <ButtonsContainer>
        <Icons.Hover
          type={
            isCollapsed ? (
              <MenuFoldOutlined title="open menu" />
            ) : (
              <MenuUnfoldOutlined title="collapse menu" />
            )
          }
          onClick={toggle}
        />

        <Route exact path="/jobs" component={ViewType} />
        <Route exact path="/jobs" component={FilterButton} />
        <Route exact path="/pipelines" component={FilterButton} />
        <Route exact path="/algorithms" component={FilterButton} />

        <Route exact path="/jobs">
          <TagsFiltersViews sectionName="jobs" />
        </Route>
        <Route exact path="/pipelines">
          <TagsFiltersViews sectionName="pipelines" />
        </Route>
        <Route exact path="/algorithms">
          <TagsFiltersViews sectionName="algorithms" />
        </Route>
      </ButtonsContainer>
      {/*  <MiddleContainer>
        <Grow>
          <AutoComplete className={USER_GUIDE.HEADER.AUTO_COMPLETE} />
        </Grow>
  </MiddleContainer> */}
      <HelpBar />
    </Container>
  );
};

export default Header;
