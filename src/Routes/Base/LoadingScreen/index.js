import React from 'react';
import styled from 'styled-components';
import { animated, useSpring } from 'react-spring';
import Particles from 'react-particles-js';
import { ReactComponent as Fish } from 'images/logo-no-shadow.svg';
import { ReactComponent as Title } from 'images/title.svg';

import { particlesTemplate } from 'config';
import { useSiteThemeMode } from 'hooks';

const TitleDark = styled.div`
  color: #ffffff;
`;
const ImageStyle = styled.div`
  .textTitleHkube {
    fill: ${props => props.theme.Styles.imageStyle.fill};
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 100vh;
  z-index: 11;
  background-image: linear-gradient(
    to top,
    ${props => props.theme.Styles.container.background}
  );
`;

const AbsoluteDiv = styled(animated.div)`
  position: absolute;
  width: 100%;
  z-index: 10;
`;

const Item = styled(animated.div)`
  z-index: 11;
`;

const ItemMargin = styled(Item)`
  margin-top: ${({ margin }) => `${margin || 10}px`};
`;

const cycle = r =>
  `translate3d(0, ${15 * Math.sin(r + (2 * Math.PI) / 1.6)}px, 0)`;

const duration = { duration: 3500 };
const fadeIn = { opacity: 1, from: { opacity: 0 }, config: { duration: 3000 } };
const moveRepeat = {
  to: async next => {
    // TODO: remove this async loop
    // eslint-disable-next-line
    for (;;) await next({ radians: 2 * Math.PI });
  },
  from: { radians: 0 },
  config: duration,
  reset: true,
};
const resize = {
  from: { x: 0 },
  to: async next => {
    // TODO: remove this async loop
    // eslint-disable-next-line
    for (;;) await next({ x: 1 });
  },
  config: duration,
  reset: true,
};
const resizeSizes = {
  range: [0, 0.25, 0.45, 0.65, 1],
  output: [0.85, 0.75, 0.85, 0.9, 0.85],
};
const scaleChange = x => `scale(${x})`;

const LoadingScreen = () => {
  const { themeName } = useSiteThemeMode();
  const opacity = useSpring(fadeIn);
  const { radians } = useSpring(moveRepeat);
  const { x } = useSpring(resize);
  const fishMove = { transform: radians.interpolate(cycle), ...opacity };
  const resizeShadow = {
    transform: x.interpolate(resizeSizes).interpolate(scaleChange),
  };

  return (
    <Container>
      <AbsoluteDiv>
        <Particles params={particlesTemplate} height="99vh" />
      </AbsoluteDiv>
      <Item style={fishMove}>
        <Fish />
      </Item>
      <ItemMargin>
        <animated.svg
          style={resizeShadow}
          width="100"
          viewBox="0 0 789 130"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <ellipse
            cx="394.5"
            cy="64.502"
            rx="394.5"
            ry="64.5"
            fill="black"
            fillOpacity="0.19"
          />
        </animated.svg>
      </ItemMargin>
      <ItemMargin style={opacity} margin={20}>
        <ImageStyle>
          <Title style={{ width: 500, height: 100 }} />
        </ImageStyle>
      </ItemMargin>
      <ItemMargin margin={5}>
        <TitleDark>{themeName} Mode</TitleDark>
      </ItemMargin>
    </Container>
  );
};

export default React.memo(LoadingScreen);
