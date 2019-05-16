import React, { useState } from 'react';
import { Card, Button } from 'antd';
import styled from 'styled-components';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { stringify } from 'utils/string';

import JsonEditor from 'components/dumb/JsonEditor.react';
import JsonEditorModal from 'components/smart/JsonEditorModal.react';
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

storiesOf('Basics|JsonEditor/Modal', module).add('Default', () => (
  <JsonEditorModal
    jsonTemplate={stringify(template)}
    styledButton={onClick => (
      <Button type="primary" icon="edit" onClick={onClick} />
    )}
    title={'Execute Pipeline Editor'}
    okText={'Execute'}
    action={action('click')}
  />
));
