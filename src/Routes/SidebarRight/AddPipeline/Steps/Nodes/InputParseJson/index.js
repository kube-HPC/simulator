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
    placeholder: '<Node name> Or <Node name>.<attribute>',
    rules: ['node'],
  },
  {
    value: '#@',
    label: '(#@)Multi output of',
    placeholder: '<Node name>.<attribute>',
    rules: ['node'],
  },
  {
    value: '',
    label: 'Value',
    placeholder: '{"key": "value"} Or [1,"2",true]]',
    rules: ['array', 'object'],
  },
  {
    value: '#',
    label: '(#) Multi Value',
    placeholder:
      '[1,2,3,4] Each entry in given array will be processed separately',
    rules: ['array'],
  },
];

const Controller = ({ nodeIdx, isRequired }) => {
  const { form, isRunPipeline } = useWizardContext();
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
    <Form.List name={['nodes', nodeIdx, 'input']}>
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, fieldKey, ...restField }) => (
            <Form.Item
              style={{ marginBottom: 10 }}
              {...restField}
              name={[name]}
              key={`InputField_${key}`}
              fieldKey={[fieldKey]}
              validateTrigger={['onChange', 'onBlur']}>
              <InputField
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
  nodeIdx: PropTypes.node.isRequired,
  isRequired: PropTypes.bool,
};

Controller.defaultProps = {
  isRequired: false,
};

export default Controller;
