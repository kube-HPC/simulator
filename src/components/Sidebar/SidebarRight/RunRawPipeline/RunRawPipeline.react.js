import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'antd';

import { stringify, notification } from 'utils';
import { addPipelineTemplate } from 'config';
import { BottomContent, JsonEditor, Card } from 'components/common';
import { execRawPipeline } from 'actions/pipeline.action';

const DEFAULT_VALUE = stringify(addPipelineTemplate);

const RunRawPipeline = () => {
  const [value, setValue] = useState(DEFAULT_VALUE);
  const dispatch = useDispatch();

  const onClear = () => setValue('');
  const onDefault = () => setValue(DEFAULT_VALUE);

  const onSubmitClick = () => {
    try {
      dispatch(execRawPipeline(JSON.parse(value)));
    } catch ({ message: description }) {
      notification({ message: 'Error in Submitted Json', description });
    }
  };

  return (
    <>
      <Card>
        <JsonEditor value={value} onChange={setValue} />
      </Card>
      <BottomContent.Divider />
      <BottomContent
        extra={[
          <Button type="danger" key="clear" onClick={onClear}>
            Clear
          </Button>,
          <Button key="default" onClick={onDefault}>
            Default
          </Button>,
        ]}>
        <Button type="primary" onClick={onSubmitClick}>
          Execute
        </Button>
      </BottomContent>
    </>
  );
};

export default RunRawPipeline;
