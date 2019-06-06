import React from 'react';
import { storiesOf } from '@storybook/react';

import AnimatedLogo from 'components/UI/Layout/Sidebar/AnimatedLogo.react';

storiesOf('Basics|Animated Logo', module).add('Default', () => (
  <AnimatedLogo />
));
