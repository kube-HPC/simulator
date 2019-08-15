import React, { useState, useEffect } from 'react';
import { notification, Icon, Card } from 'antd';
import { DrawerContainer } from '.';
import { JsonEditor } from 'components/common';

const redIconStyle = { color: 'red' };

const DrawerEditor = ({ children, valueString, onSubmit, ...props }) => {
  const [value, setValue] = useState(valueString);

  const { title, description, opener, submitText } = props;

  useEffect(() => {
    setValue(valueString);
  }, [valueString, setValue]);

  const onSubmitClick = () => {
    try {
      onSubmit(JSON.parse(value));
    } catch (e) {
      notification.config({
        placement: 'bottomRight'
      });
      notification.open({
        message: 'Error in Submitted Json',
        description: e.message,
        icon: <Icon type="warning" style={redIconStyle} />
      });
    }
  };

  return (
    <DrawerContainer
      title={title}
      description={description}
      opener={opener}
      submitText={submitText}
      onSubmit={onSubmitClick}
    >
      <Card size="small">
        <JsonEditor isControlled value={value} onChange={setValue} />
      </Card>
    </DrawerContainer>
  );
};

export default DrawerEditor;
