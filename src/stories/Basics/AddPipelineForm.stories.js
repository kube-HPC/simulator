import React, { useState } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import AddPipelineForm from 'components/dumb/AddPipelineForm.react';
import addPipelineTemplate from 'config/addPipeline.template.json';

function Container() {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState(addPipelineTemplate);
  return (
    <AddPipelineForm
      formData={formData}
      algorithms={['a1', 'a2']}
      pipelines={['p1', 'p2']}
      onSubmit={action('click')}
      onChange={setFormData}
      onStep={setCurrent}
      step={current}
    />
  );
}

storiesOf('Basics|AddPipelineForm', module).add('Default', () => <Container />);
