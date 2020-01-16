import { Button } from 'antd';
import { BottomContent, Card, JsonEditor } from 'components/common';
import { addPipelineTemplate } from 'config';
import { useActions } from 'hooks';
import React, { useState } from 'react';
import { notification, stringify } from 'utils';

// eslint-disable-next-line
const { triggers, ...noTriggersPipeline } = addPipelineTemplate;

const DEFAULT_VALUE = stringify(noTriggersPipeline);

const RunRawPipeline = () => {
  const [value, setValue] = useState(DEFAULT_VALUE);
  const { execRawPipeline } = useActions();

  const onClear = () => setValue('');
  const onDefault = () => setValue(DEFAULT_VALUE);

  const onSubmitClick = () => {
    try {
      execRawPipeline(JSON.parse(value));
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
