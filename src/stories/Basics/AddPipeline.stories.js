import React, { useState } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import styled from 'styled-components';

import AddPipeline from 'components/dumb/AddPipeline.react';

import addPipelineTemplate from 'config/addPipeline.template.json';

import Sidebar from 'react-sidebar';
import { Card } from 'antd';

const StyledCard = styled(Card)`
  width: 120vh;
`;

function AddPipelineContainer() {
  const [formData, setFormData] = useState(addPipelineTemplate);
  return (
    <StyledCard>
      <AddPipeline
        formData={formData}
        algorithms={['a1', 'a2']}
        pipelines={['p1', 'p2']}
        onSubmit={action('click')}
        onChange={setFormData}
      />
    </StyledCard>
  );
}

const Component = <AddPipelineContainer />;

storiesOf('Basics|AddPipeline', module)
  .add('Default', () => Component)
  .add('Sidebar', () => (
    <Sidebar
      style={{ sidebar: { width: '150vh' } }}
      sidebar={Component}
      pullRight={true}
      docked={true}
    />
  ));
