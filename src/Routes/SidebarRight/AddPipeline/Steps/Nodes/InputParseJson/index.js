import React from 'react';
import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import { Form, Button, Alert } from 'antd';
import InputField from './InputField';
import useWizardContext from '../../../useWizardContext';

const listAddOn = ['', '@', '#', '#@'];

const Controller = ({ nodeIdx, isRequired }) => {
  const { form } = useWizardContext();
  const inputValues = form.getFieldValue(['nodes', nodeIdx, 'input']);

  const isRequiredMsg = () =>
    isRequired &&
    (inputValues === undefined ||
      inputValues[0] === '' ||
      inputValues[0] === undefined) ? (
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
