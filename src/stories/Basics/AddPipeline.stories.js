import React, { useState, useRef } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Sidebar from 'react-sidebar';
import PropTypes from 'prop-types';

import AddPipelineSteps from 'components/dumb/AddPipeline/AddPipelineSteps.react';
import AddPipelineForm from 'components/dumb/AddPipeline/AddPipelineForm.react';
import addPipelineTemplate from 'config/template/addPipeline.template';

function AddPipelineContainer({ style }) {
  return (
    <AddPipelineSteps
      algorithms={['a1', 'a2']}
      pipelines={['p1', 'p2']}
      onSubmit={action('click')}
      style={style}
    />
  );
}

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

storiesOf('Basics|AddPipeline/Form', module).add('Default', () => <Container />);

storiesOf('Basics|AddPipeline/Steps', module)
  .add('Default', () => <AddPipelineContainer />)
  .add('Sidebar', () => (
    <Sidebar
      sidebar={<AddPipelineContainer style={{ width: '120vh' }} />}
      pullRight={true}
      docked={true}
    >
      <div />
    </Sidebar>
  ));

AddPipelineContainer.propTypes = {
  style: PropTypes.object
};
