import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { useSelector } from 'react-redux';

import { Form } from 'components/common';
import addPipelineSchema from 'config/schema/addPipeline.schema';
import CronInput from './CronInput.react';
import { FormContext } from '../../AddPipelineForm.react';
import { STATE_SOURCES } from 'const';

const { CRON, PIPELINES } = addPipelineSchema.TRIGGERS;

const pipelineNamesSelector = state =>
  state[STATE_SOURCES.PIPELINE_TABLE].dataSource.map(({ name }) => name);

const Triggers = () => {
  const { getFieldDecorator } = useContext(FormContext);
  const pipelines = useSelector(pipelineNamesSelector);

  return (
    <>
      <Form.Item label={CRON.label}>
        <CronInput placeholder={CRON.placeholder} />
      </Form.Item>
      <Form.Item label={PIPELINES.label}>
        {getFieldDecorator(PIPELINES.field)(
          <Select mode="multiple" placeholder={PIPELINES.placeholder}>
            {pipelines.map(pipeline => (
              <Select.Option key={pipeline} value={pipeline}>
                {pipeline}
              </Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>
    </>
  );
};

Triggers.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  setFieldsValue: PropTypes.func.isRequired
};

export default Triggers;
