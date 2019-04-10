import React, { useState } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import AddPipeline from 'components/containers/AddPipeline.react';

import addPipelineTemplate from 'config/addPipeline.template.json';

function AddPipelineContainer() {
  const [formData, setFormData] = useState(addPipelineTemplate);
  return (
    <AddPipeline
      formData={formData}
      algorithms={['a1', 'a2']}
      pipelines={['p1', 'p2']}
      onSubmit={action('click')}
      onChange={setFormData}
    />
  );
}

storiesOf('Basics|AddPipeline', module).add('Default', () => <AddPipelineContainer />);
