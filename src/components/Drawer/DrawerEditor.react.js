import React, { useState, useEffect } from 'react';
import { notification, Icon, Button } from 'antd';
import { Drawer } from '.';
import { JsonEditor, BottomContent, Card } from 'components/common';

const configNotificationOnOpen = description => ({
  message: 'Error in Submitted Json',
  description,
  icon: <Icon type="warning" style={{ color: 'red' }} />
});

notification.config({
  placement: 'bottomRight'
});

const DrawerEditor = ({ valueString, ...props }) => {
  const [value, setValue] = useState(valueString);

  const { title, opener, submitText, onSubmit } = props;

  useEffect(() => {
    setValue(valueString);
  }, [valueString, setValue]);

  const onClearClick = () => setValue('');

  const onSubmitClick = () => {
    try {
      onSubmit(JSON.parse(value));
    } catch ({ message }) {
      notification.open(configNotificationOnOpen(message));
    }
  };

  return (
    <Drawer title={title} opener={opener} onSubmit={onSubmitClick}>
      <Card>
        <JsonEditor isControlled value={value} onChange={setValue} />
      </Card>
      <BottomContent
        extra={[
          <Button key="clear" type="danger" onClick={onClearClick}>
            Clear
          </Button>
        ]}
      >
        <Button type="primary" onClick={onSubmitClick}>
          {submitText || 'Submit'}
        </Button>
      </BottomContent>
    </Drawer>
  );
};

export default DrawerEditor;
