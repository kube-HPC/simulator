import React, { useState } from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { Layout } from 'antd';

import rootReducer from 'reducers/root.reducer';
import SidebarLeft from 'components/UI/Layout/SidebarMainTables/SidebarLeft.react';

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

const store = createStore(rootReducer);

function SiderContainer() {
  const [counter, setCounter] = useState(0);

  return (
    <Provider store={store}>
      <LayoutStyled>
        <SidebarLeft {...props} onSelect={() => setCounter(counter + 1)} />
        <LayoutCenter>
          <StyledCounter>{counter}</StyledCounter>
        </LayoutCenter>
      </LayoutStyled>
    </Provider>
  );
}

storiesOf('BASICS|Sider', module).add('Default', () => <SiderContainer />);
