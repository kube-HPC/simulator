import { FlexBox, Icons } from 'components/common';
import { LEFT_SIDEBAR_NAMES } from 'const';
import { useLeftSidebar } from 'hooks';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Display } from 'styles';
import ViewType from './ViewType.react';

const Container = styled(FlexBox.Auto)`
  padding: 0px 5px;
`;

const SidebarActions = () => {
  const {
    value: [tableValue],
    isCollapsed: [leftIsCollapsed, setLeftIsCollapsed],
  } = useLeftSidebar();

  const triggerLeftVisible = useCallback(() => setLeftIsCollapsed(prev => !prev), [
    setLeftIsCollapsed,
  ]);

  return (
    <Container>
      <Icons.Hover
        type={leftIsCollapsed ? `menu-fold` : `menu-unfold`}
        onClick={triggerLeftVisible}
      />
      <Display hidden={tableValue !== LEFT_SIDEBAR_NAMES.JOBS}>
        <ViewType />
      </Display>
    </Container>
  );
};

export default SidebarActions;
