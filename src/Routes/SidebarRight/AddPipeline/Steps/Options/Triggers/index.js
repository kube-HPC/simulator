import React from 'react';
import { Select } from 'antd';
import { Form } from 'components/common';
import { useGetLists } from 'hooks/graphql';

import CronInput from './CronInput';

const Triggers = () => {
  const { pipelines: pipelineNames } = useGetLists();
  return (
    <>
      <Form.Item label="Cron">
        <CronInput placeholder="Pattern" />
      </Form.Item>
      <Form.Item label="Pipelines" name={['triggers', 'pipelines']}>
        <Select
          mode="multiple"
          placeholder="Pick Pipelines to Trigger Current One">
          {pipelineNames &&
            pipelineNames.map(item => (
              <Select.Option
                key={`pipeline-name-${item.label}`}
                value={item.value}>
                {item.label}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
    </>
  );
};

export default Triggers;
