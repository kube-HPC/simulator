import React, { useState } from 'react';
import styled from 'styled-components';

import { ReactComponent as Logo } from 'images/logo-no-shadow.svg';
import { ReactComponent as LogoShadow } from 'images/logo-shadow.svg';
import { animated, useSpring, interpolate } from 'react-spring';

const CenteredLogo = styled.div`
  margin-top: 20px;
  display: flex;
  width: 70px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
`;

const CenterLogo = styled(animated.div)`
  align-self: center;
`;

const cycle = r =>
  `translate3d(0, ${15 * Math.sin(r + (2 * Math.PI) / 1.6)}px, 0)`;

export default function AnimatedLogo() {
  const { radians } = useSpring({
    to: async next => {
      while (1) await next({ radians: 2 * Math.PI });
    },
    from: { radians: 0 },
    config: { duration: 3500 },
    reset: true
  });

  return (
    <CenteredLogo>
      <Logo />
      <LogoShadow />
    </CenteredLogo>
  );
}
