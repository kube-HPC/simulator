import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { animated } from 'react-spring';
import { STATE_SOURCES } from 'reducers/root.reducer';
import { COLOR, COLOR_LAYOUT } from 'styles/colors';
import { Typography, Spin, Icon } from 'antd';

const CenterScreen = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 100vh;
  z-index: 11;
  background-color: ${COLOR_LAYOUT.backgroundOnModal};
`;

const CenterItem = styled(animated.div)`
  margin: 20px;
`;

const whiteFont = { color: COLOR.white };
const antIcon = <Icon type="loading" style={{ fontSize: 100, color: 'white' }} spin />;

const LoadingScreen = () => {
  const isConnected = useSelector(state => state[STATE_SOURCES.SOCKET_STATUS]);

  return (
    !isConnected && (
      <CenterScreen>
        <CenterItem>
          <Spin indicator={antIcon} />
        </CenterItem>
        <Typography.Title style={whiteFont}>Connecting to Socket...</Typography.Title>
      </CenterScreen>
    )
  );
};

export default LoadingScreen;
