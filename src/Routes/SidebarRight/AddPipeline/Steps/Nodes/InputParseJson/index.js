import React from 'react';
import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import { Form, Button, Alert } from 'antd';
import InputField from './InputField';
import useWizardContext from '../../../useWizardContext';

const listAddOn = [
  { value: '@', label: '(@) Output of', placeholder: '1111' },
  { value: '#@', label: '(#@) Output array of', placeholder: '2222' },
  { value: '#', label: '(#) Output', placeholder: '333' },
  { value: '', label: 'Value', placeholder: '4444' },
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
