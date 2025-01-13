import React from 'react';
import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import { Form, Button, Alert } from 'antd';
import InputField from './InputField';
import useWizardContext from '../../../useWizardContext';

const listAddOn = [
  {
    value: '@',
    label: '(@)Output of',
    placeholder: '<Node name> Or <Node name>.<attribute> Or flowinput.<prop>',
    rules: ['node', 'flowinput'],
  },
  {
    value: '#@',
    label: '(#@)Multi output of',
    placeholder: '<Node name>.<attribute> Or flowinput.<prop>',
    rules: ['node', 'flowinput'],
  },
  {
    value: '',
    label: 'Value',
    placeholder: '{"key": "value"} Or [1,"2",true] Or "string"',
    rules: ['array', 'object', 'string'],
  },
  {
    value: '#',
    label: '(#) Multi Value',
    placeholder:
      '[1,2,3,4] Each entry in given array will be processed separately',
    rules: ['array'],
  },
];

const Controller = ({ node, nodeIdx, isRequired = false }) => {
  const { form, isRunPipeline, isStreamingPipeline } = useWizardContext();
  const inputValues = form.getFieldValue(['nodes', nodeIdx, 'input']);

  const isRequiredMsg = () =>
    isRequired && inputValues && !inputValues[0] ? (
      <Alert
        type="error"
        message="You must put in at least one input."
        banner
      />
    ) : (
      ''
    );

  return (
    <Form.List name={['nodes', nodeIdx, 'input']} initialValue={[]}>
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, fieldKey, ...restField }) => (
            <Form.Item
              className={isStreamingPipeline && 'hidden-addon-before'}
              style={{ marginBottom: 10 }}
              {...restField}
              name={[name]}
              key={`InputField_${key}`}
              fieldKey={[fieldKey]}
              validateTrigger={['onChange', 'onBlur']}>
              <InputField
                valueJson={node?.input ? node?.input[key] : ''}
                addonBefore={listAddOn}
                onRemove={
                  (isRequired && name > 0) || isRequired === false
                    ? () => remove(name)
                    : null
                }
              />
            </Form.Item>
          ))}
          {!isRunPipeline && (
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}>
                Add input
              </Button>
              {isRequiredMsg()}
            </Form.Item>
          )}
        </>
      )}
    </Form.List>
  );
};

Controller.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  node: PropTypes.instanceOf([
    PropTypes.number,
    PropTypes.string,
    PropTypes.array,
    PropTypes.object,
  ]).isRequired,
  nodeIdx: PropTypes.node.isRequired,
  isRequired: PropTypes.bool,
};

export default Controller;
