import React, { useState } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import AddPipelineSteps from 'components/dumb/AddPipelineSteps.react';

import addPipelineTemplate from 'config/addPipeline.template.json';

const Component = (
  <AddPipelineSteps
    formData={addPipelineTemplate}
    algorithms={['a1', 'a2']}
    pipelines={['p1', 'p2']}
    action={action('click')}
  />
);

storiesOf('Basics|AddPipelineSteps', module).add('Default', () => Component);
