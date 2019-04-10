import React, { useState } from 'react';

import { storiesOf } from '@storybook/react';

import AddPipelineSteps from 'components/dumb/AddPipelineSteps.react';

import addPipelineTemplate from 'config/addPipeline.template.json';

storiesOf('Basics|AddPipelineSteps', module).add('Default', () => (
  <AddPipelineSteps
    formData={addPipelineTemplate}
    algorithms={['a1', 'a2']}
    pipelines={['p1', 'p2']}
  />
));
