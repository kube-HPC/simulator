import { Card } from 'antd';
import { JsonEditor } from 'components/common';
import { addPipelineTemplate } from 'config';
import { useActions } from 'hooks';
import React, { useState } from 'react';
import { notification, stringify } from 'utils';
import {
  BottomPanel,
  RightAlignedButton,
  PanelButton,
} from 'components/Drawer';

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
      <Card style={{ flex: 1 }} styles={{ body: { height: '100%' } }}>
        <JsonEditor value={value} onChange={setValue} height="100%" />
      </Card>
      <BottomPanel>
        <PanelButton type="danger" key="clear" onClick={onClear}>
          Clear
        </PanelButton>
        <PanelButton key="default" onClick={onDefault}>
          Default
        </PanelButton>
        <RightAlignedButton type="primary" onClick={onSubmitClick}>
          Execute
        </RightAlignedButton>
      </BottomPanel>
    </>
  );
};

export default RunRawPipeline;
