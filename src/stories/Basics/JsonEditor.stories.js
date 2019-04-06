import React from 'react';

import { storiesOf } from '@storybook/react';
import { Card } from 'antd';
import { stringify } from 'utils';
import styled from 'styled-components';

import JsonEditor from 'components/dumb/JsonEditor.react';
import addPipelineTemplate from 'config/addPipeline.template.json';

const StyledCard = styled(Card)`
  width: 40%;
  margin: 10px;
`;

storiesOf('Basics|JsonEditor', module)
  .add('Default', () => <JsonEditor value={stringify(addPipelineTemplate)} onChange={() => {}} />)
  .add('Card', () => (
    <StyledCard size="small" title="Json Editor">
      <JsonEditor value={stringify(addPipelineTemplate)} onChange={() => {}} />
    </StyledCard>
  ));
