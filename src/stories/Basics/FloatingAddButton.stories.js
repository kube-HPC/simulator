import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import FloatingAddButton from 'components/dumb/FloatingAddButton.react';

storiesOf('Basics|FloatingAddButton', module).add('Default', () => (
  <FloatingAddButton onClick={action('clicked')} />
));
