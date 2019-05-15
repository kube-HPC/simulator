import React, { useState } from 'react';
import { Card, Button } from 'antd';
import styled from 'styled-components';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { stringify } from 'utils/string';

import JsonEditor from 'components/dumb/JsonEditor.react';
import JsonEditorModal from 'components/smart/JsonEditorModal.react';
import template from 'config/template/addPipeline.template';

import MonacoEditor from 'react-monaco-editor';

const StyledCard = styled(Card)`
  width: 40%;
  margin: 0 auto;
`;

function MonacoContainer() {
  const [value, setValue] = useState(stringify(template));
  return (
    <Card>
      <MonacoEditor
        width="800"
        height="600"
        language="json"
        value={value}
        onChange={setValue}
      />
    </Card>
  );
}

storiesOf('Basics|JsonEditor/Default', module)
  .add('Default', () => (
    <JsonEditor value={stringify(template)} onChange={() => {}} />
  ))
  .add('Card', () => (
    <StyledCard size="small" title="Json Editor">
      <JsonEditor value={stringify(template)} onChange={() => {}} />
    </StyledCard>
  ))
  .add('Monaco Editor', () => <MonacoContainer />);

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
