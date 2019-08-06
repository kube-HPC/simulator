import React from 'react';
import styled from 'styled-components';

import { animated, useSpring } from 'react-spring';
import { ReactComponent as Fish } from 'images/logo-no-shadow.svg';

const CenterScreen = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
`;

const CenterItem = styled(animated.div)`
  align-self: center;
  margin-top: 20px;
`;

const cycle = r =>
  `translate3d(0, ${15 * Math.sin(r + (2 * Math.PI) / 1.6)}px, 0)`;

function LoadingScreen() {
  const { radians } = useSpring({
    to: async next => {
      while (1) await next({ radians: 2 * Math.PI });
    },
    from: { radians: 0 },
    config: { duration: 3500 },
    reset: true
  });

  const { x } = useSpring({
    from: { x: 0 },
    to: async next => {
      while (1) await next({ x: 1 });
    },
    config: { duration: 3500 },
    reset: true
  });

  return (
    <CenterScreen>
      <CenterItem style={{ transform: radians.interpolate(cycle) }}>
        <Fish />
      </CenterItem>
      <CenterItem>
        <animated.svg
          style={{
            transform: x
              .interpolate({
                range: [0, 0.25, 0.45, 0.65, 1],
                output: [0.85, 0.75, 0.85, 0.9, 0.85]
              })
              .interpolate(x => `scale(${x})`)
          }}
          width="100"
          viewBox="0 0 789 130"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            cx="394.5"
            cy="64.502"
            rx="394.5"
            ry="64.5"
            fill="black"
            fillOpacity="0.19"
          />
        </animated.svg>
      </CenterItem>
    </CenterScreen>
  );
}

export default LoadingScreen;
