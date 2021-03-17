import React from 'react';
import { Select } from 'antd';
import { useSelector } from 'react-redux';
import { Form } from 'components/common';
import { selectors } from 'reducers/pipeline.reducer';
import CronInput from './CronInput';
import useWizardContext from '../../../useWizardContext';

const Triggers = () => {
  const pipelineNames = useSelector(selectors.collection.names);
  const { fieldDecorator } = useWizardContext();
  return (
    <>
      <Form.Item label="Cron">
        <CronInput placeholder="Pattern" />
      </Form.Item>
      <Form.Item label="Pipelines">
        {fieldDecorator('triggers.pipelines')(
          <Select
            mode="multiple"
            placeholder="Pick Pipelines to Trigger Current One">
            {pipelineNames.map(name => (
              <Select.Option key={`pipeline-name-${name}`} value={name}>
                {name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>
    </>
  );
};

export default Triggers;
