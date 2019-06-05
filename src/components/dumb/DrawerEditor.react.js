import React, { useState } from 'react';
import { notification, Icon, Card } from 'antd';

import JsonEditor from 'components/dumb/JsonEditor.react';
import DrawerContainer from 'components/dumb/DrawerContainer.react';

function DrawerEditor({ children, valueString, onSubmit, ...props }) {
  const [value, setValue] = useState(valueString);

  return (
    <DrawerContainer
      title={props.title}
      description={props.description}
      opener={props.opener}
      submitText={props.submitText || 'Submit'}
      onSubmit={() => {
        try {
          onSubmit(JSON.parse(value));
        } catch (e) {
          notification.config({
            placement: 'bottomRight'
          });
          notification.open({
            message: 'Error in Submitted Json',
            description: e.message,
            icon: <Icon type="warning" style={{ color: 'red' }} />
          });
        }
      }}
    >
      <Card size="small">
        <JsonEditor value={value} onChange={setValue} />
      </Card>
    </DrawerContainer>
  );
}

export default DrawerEditor;
