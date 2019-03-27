import { useSpring, animated } from 'react-spring';
import React from 'react';

export default function AnimatedHeader() {
  const props = useSpring({ opacity: 1, from: { opacity: 0 } });
  return (
    <animated.div style={props}>
      <span className="header-title">Hkube</span>
    </animated.div>
  );
}
