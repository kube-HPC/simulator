import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import AddPipelineSteps from 'components/dumb/AddPipelineSteps.react';
import addPipelineTemplate from 'config/addPipeline.template.json';

import Sidebar from 'react-sidebar';
import PropTypes from 'prop-types';

function AddPipelineContainer({ style }) {
  const [formData, setFormData] = useState(addPipelineTemplate);
  return (
    <AddPipelineSteps
      formData={formData}
      algorithms={['a1', 'a2']}
      pipelines={['p1', 'p2']}
      onSubmit={action('click')}
      onChange={setFormData}
      style={style}
    />
  );
}

storiesOf('Basics|AddPipelineSteps', module)
  .add('Default', () => <AddPipelineContainer />)
  .add('Sidebar', () => (
    <Sidebar
      sidebar={<AddPipelineContainer style={{ width: '140vh' }} />}
      pullRight={true}
      docked={true}
    >
      <div />
    </Sidebar>
  ));

AddPipelineContainer.propTypes = {
  style: PropTypes.object
};
