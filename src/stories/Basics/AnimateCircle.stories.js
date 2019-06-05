import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { animated, useSpring, interpolate } from 'react-spring';
import styled from 'styled-components';

const Circle = styled(animated.div)`
  background: palevioletred;
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50px;
  width: 50px;
  height: 50px;
`;

function AnimateCircle() {
  const { x } = useSpring({
    from: { x: 0 },
    to: async next => {
      while (1) await next({ x: 1 });
    },
    config: { duration: 3500 },
    reset: true
  });
  return (
    <Circle
      style={{
        transform: x
          .interpolate({
            range: [0, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 1],
            output: [1, 2, 3, 4, 5, 4, 2, 1]
          })
          .interpolate(x => `scale(${x})`)
      }}
    />
  );
}

storiesOf('Basics|Animated Circle', module).add('Default', () => (
  <AnimateCircle />
));
