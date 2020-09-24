import { FlexBox, Icons } from 'components/common';
import { useLeftSidebar } from 'hooks';
import React from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
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
      <Route exact path="/jobs" component={ViewType} />
    </Container>
  );
};

export default SidebarActions;
