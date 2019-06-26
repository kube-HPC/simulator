import React from 'react';
import { Card } from 'antd';
import styled from 'styled-components';

import { storiesOf } from '@storybook/react';

import { stringify } from 'utils/string';

import JsonEditor from 'components/common/json/JsonEditor.react';
import template from 'config/template/addPipeline.template';

const StyledCard = styled(Card)`
  width: 45%;
  height: 65vh;
  margin: 0 auto;
`;

storiesOf('Basics|JsonEditor/Default', module)
  .add('Default', () => <JsonEditor value={stringify(template)} />)
  .add('Card', () => (
    <StyledCard>
      <JsonEditor width={'100%'} height={'60vh'} value={stringify(template)} />
    </StyledCard>
  ))
  .add('Monaco Editor', () => <JsonEditor value={stringify(template)} />);
