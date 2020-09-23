import { FlexBox, Icons } from 'components/common';
// import { LEFT_SIDEBAR_NAMES } from 'const';
import { useLeftSidebar } from 'hooks';
import React from 'react'; // { useCallback } from 'react';
import styled from 'styled-components';
import { Display } from 'styles';
import ViewType from './ViewType.react';

const Container = styled(FlexBox.Auto)`
  padding: 0px 5px;
`;

const SidebarActions = () => {
  const { toggle, isCollapsed } = useLeftSidebar();

  return (
    <Container>
      <Icons.Hover
        type={isCollapsed ? `menu-fold` : `menu-unfold`}
        onClick={toggle}
      />
      {/* <Display hidden={tableValue !== LEFT_SIDEBAR_NAMES.JOBS}> */}
      <Display hidden={false}>
        <ViewType />
      </Display>
    </Container>
  );
};

export default SidebarActions;
