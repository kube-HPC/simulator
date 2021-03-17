import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { useSelector } from 'react-redux';
import { Form } from 'components/common';
import { selectors } from 'reducers/pipeline.reducer';
import CronInput from './CronInput';

const Triggers = ({ getFieldDecorator }) => {
  const pipelineNames = useSelector(selectors.collection.names);

  return (
    <>
      <Form.Item label="Cron">
        <CronInput
          placeholder="Pattern"
          getFieldDecorator={getFieldDecorator}
        />
      </Form.Item>
      <Form.Item label="Pipelines">
        {getFieldDecorator('triggers.pipelines')(
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

Triggers.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
};

export default Triggers;
