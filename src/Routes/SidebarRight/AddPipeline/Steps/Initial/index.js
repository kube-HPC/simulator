import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Input, Radio, Select } from 'antd';
import { Form, EditableTagGroup } from 'components/common';
import { useExperiments } from 'hooks';
import ControllerKeyValue from '../Nodes/inputKeyValueJson';
import useWizardContext from '../../useWizardContext';

const { Option } = Select;

/** @param {{ style: import('react').CSSProperties }} props */
const Initial = ({ style }) => {
  const { isEdit, isRunPipeline, valuesState } = useWizardContext();

  // get list nodes
  const nodeNames = useMemo(
    () => valuesState?.nodes?.map(item => item?.nodeName),
    [valuesState]
  );

  const { experiments } = useExperiments();

  return (
    <div style={style}>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Pipeline name is required' }]}
        required>
        <Input disabled={isEdit} placeholder="Unique Identifier" />
      </Form.Item>
      <Form.Item label="Description" name="description">
        <Input disabled={isRunPipeline} placeholder="Pipeline Description" />
      </Form.Item>
      <Form.Item
        label="Pipeline Kind"
        name="kind"
        rules={[{ required: true }]}
        initialValue="batch">
        <Radio.Group disabled={isRunPipeline}>
          <Radio.Button value="batch">Batch</Radio.Button>
          <Radio.Button value="stream">Streaming</Radio.Button>
        </Radio.Group>
      </Form.Item>

      {isRunPipeline && (
        <>
          <Form.Item label="experiments" name={['experimentName']}>
            <Select style={{ width: '100%' }}>
              {experiments.map(experiment => (
                <Option key={experiment.name}>{experiment.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Debug Override" name={['debugOverride']}>
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select">
              {nodeNames.map(nodeName => (
                <Option key={nodeName}>{nodeName}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Tags" name={['tags']}>
            <EditableTagGroup />
          </Form.Item>
        </>
      )}

      <Form.Item label="Flow Input" name={['flowInput']}>
        <ControllerKeyValue nameRef={['flowInput']} />
      </Form.Item>
    </div>
  );
};

Initial.propTypes = {
  // eslint-disable-next-line
  style: PropTypes.object.isRequired,
};

export default Initial;
