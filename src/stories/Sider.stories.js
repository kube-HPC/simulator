import { Layout } from 'antd';
import SidebarLeft from 'components/Sidebar/SidebarLeft/SidebarLeft.react';
import React, { useState } from 'react';
import styled from 'styled-components';
import { SB_SECTIONS } from 'const';

const LayoutStyled = styled(Layout)`
  height: 100vh;
`;

const LayoutCenter = styled(Layout)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledCounter = styled.h1`
  font-size: 10em;
  text-align: center;
  color: palevioletred;
`;

const props = {
  jobsCount: 5,
  driversCount: 3,
  algorithmsCount: undefined,
  buildsCount: 2,
  pipelinesCount: 5,
  workersCount: undefined,
  debugCount: 4
};

function SiderContainer() {
  const [counter, setCounter] = useState(0);

  return (
    <LayoutStyled>
      <SidebarLeft {...props} onSelect={() => setCounter(counter + 1)} />
      <LayoutCenter>
        <StyledCounter>{counter}</StyledCounter>
      </LayoutCenter>
    </LayoutStyled>
  );
}

export default {
  title: `${SB_SECTIONS.LEFT}|Sider`
};

export const Sider = () => <SiderContainer />;
