import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Button, notification, Icon } from 'antd';

import { stringify } from 'utils';
import { addPipelineTemplate } from 'config';
import { BottomContent, JsonEditor, Card } from 'components/common';
import { execRawPipeline } from 'actions/pipeline.action';

const DEFAULT_VALUE = stringify(addPipelineTemplate);
const warningIcon = <Icon type="warning" style={{ color: 'red' }} />;

notification.config({
  placement: 'bottomRight'
});

const notificationOnOpenConfig = message => ({
  message: 'Error in Submitted Json',
  description: message,
  icon: warningIcon
});

const RunRawPipeline = ({ onSubmit }) => {
  const [value, setValue] = useState(DEFAULT_VALUE);
  const dispatch = useDispatch();

  const onClear = () => setValue('');
  const onDefault = () => setValue(DEFAULT_VALUE);

  const onSubmitClick = () => {
    try {
      dispatch(execRawPipeline(JSON.parse(value)));
      onSubmit();
    } catch ({ message }) {
      notification.open(notificationOnOpenConfig(message));
    }
  };

  return (
    <>
      <Card>
        <JsonEditor isControlled value={value} onChange={setValue} />
      </Card>
      <BottomContent
        extra={[
          <Button type="danger" key="clear" onClick={onClear}>
            Clear
          </Button>,
          <Button key="default" onClick={onDefault}>
            Default
          </Button>
        ]}
      >
        <Button type="primary" onClick={onSubmitClick}>
          Execute
        </Button>
      </BottomContent>
    </>
  );
};

RunRawPipeline.propsTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default RunRawPipeline;
