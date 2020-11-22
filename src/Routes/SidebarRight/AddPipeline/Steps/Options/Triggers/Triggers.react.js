import React, { useContext } from 'react';
import { Select } from 'antd';
import { useSelector } from 'react-redux';
import { Form } from 'components/common';
import addPipelineSchema from 'config/schema/addPipeline.schema';
import { selectors } from 'reducers/pipeline.reducer';
import CronInput from './CronInput.react';
import { FormContext } from '../../../Form/AddPipelineForm.react';

const { CRON, PIPELINES } = addPipelineSchema.TRIGGERS;

const Triggers = () => {
  const { getFieldDecorator } = useContext(FormContext);
  const pipelineNames = useSelector(selectors.collection.names);

  return (
    <>
      <Form.Item label={CRON.label}>
        <CronInput placeholder={CRON.placeholder} />
      </Form.Item>
      <Form.Item label={PIPELINES.label}>
        {getFieldDecorator(PIPELINES.field)(
          <Select mode="multiple" placeholder={PIPELINES.placeholder}>
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
