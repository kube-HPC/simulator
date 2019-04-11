import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import SideBarAddPipeline from 'components/containers/SideBarAddPipeline.react';

const content = {
  algorithms: ['a1', 'a2'],
  pipelines: ['p1', 'p2'],
  onSubmit: action('click')
};

storiesOf('UI|SideBarAddPipeline', module).add('Default', () => (
  <SideBarAddPipeline content={content} />
));
