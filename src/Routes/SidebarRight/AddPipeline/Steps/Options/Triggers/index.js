import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { useSelector } from 'react-redux';
import { Form } from 'components/common';
import { selectors } from 'reducers/pipeline.reducer';
import CronInput from './CronInput';
import addPipelineSchema from './../../../schema';

const { CRON, PIPELINES } = addPipelineSchema.TRIGGERS;

const Triggers = ({ getFieldDecorator }) => {
  const pipelineNames = useSelector(selectors.collection.names);

  return (
    <>
      <Form.Item label={CRON.label}>
        <CronInput
          placeholder={CRON.placeholder}
          getFieldDecorator={getFieldDecorator}
        />
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

Triggers.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
};

export default Triggers;
