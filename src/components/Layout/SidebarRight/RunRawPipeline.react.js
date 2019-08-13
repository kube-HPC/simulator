import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Button, Card, notification, Icon } from 'antd';

import { stringify } from 'utils';
import { addPipelineTemplate } from 'config';
import { BottomContent, JsonEditor } from 'components/common';
import { execRawPipeline } from 'actions/pipeline.action';

const redIconStyle = { color: 'red' };

const DEFAULT_VALUE = stringify(addPipelineTemplate);
const warningIcon = <Icon type="warning" style={redIconStyle} />;

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
      notification.config({
        placement: 'bottomRight'
      });
      notification.open({
        message: 'Error in Submitted Json',
        description: message,
        icon: warningIcon
      });
    }
  };

  return (
    <>
      <Card size="small">
        <JsonEditor isControlled value={value} onChange={setValue} />
      </Card>
      <BottomContent
        extra={[
          <Button key="default" onClick={onDefault}>
            Default
          </Button>,
          <Button type="danger" key="clear" onClick={onClear}>
            Clear
          </Button>
        ]}
      >
        <Button type="primary" onClick={onSubmitClick}>
          Execute Raw Pipeline
        </Button>
      </BottomContent>
    </>
  );
};

RunRawPipeline.propsTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default RunRawPipeline;
