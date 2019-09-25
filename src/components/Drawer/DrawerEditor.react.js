import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { notification, Icon, Button } from 'antd';
import { Drawer } from '.';
import { BottomContent, Card, JsonEditor } from 'components/common';

const configNotificationOnOpen = description => ({
  message: 'Error in Submitted Json',
  description,
  icon: <Icon type="warning" style={{ color: 'red' }} />
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
      <BottomContent.Divider />
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

DrawerEditor.propTypes = {
  valueString: PropTypes.string,
  title: PropTypes.element,
  opener: PropTypes.func,
  submitText: PropTypes.string,
  onSubmit: PropTypes.func
};

export default DrawerEditor;
