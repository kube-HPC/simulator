import { Button, Card } from 'antd';
import { JsonEditor } from 'components/common';
import { addPipelineTemplate } from 'config';
import { useActions } from 'hooks';
import React, { useState } from 'react';
import { notification, stringify } from 'utils';
import { BottomPanel } from 'components/Drawer';

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
      <Card
        style={{ flex: 1, marginBottom: '1em' }}
        bodyStyle={{ height: '100%' }}>
        <JsonEditor value={value} onChange={setValue} height="100%" />
      </Card>
      <BottomPanel>
        <Button type="danger" key="clear" onClick={onClear}>
          Clear
        </Button>
        <Button key="default" onClick={onDefault}>
          Default
        </Button>
        <Button
          type="primary"
          onClick={onSubmitClick}
          style={{ marginLeft: 'auto' }}>
          Execute
        </Button>
      </BottomPanel>
    </>
  );
};

export default RunRawPipeline;
