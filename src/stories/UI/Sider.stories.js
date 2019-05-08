import React, { useState } from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';

import { Layout } from 'antd';

import Sidebar from 'components/UI/Layout/Sidebar.react';

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
      <Sidebar {...props} onSelect={() => setCounter(counter + 1)} />
      <LayoutCenter>
        <StyledCounter>{counter}</StyledCounter>
      </LayoutCenter>
    </LayoutStyled>
  );
}

storiesOf('UI|Sider', module).add('Default', () => <SiderContainer />);
