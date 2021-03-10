import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { Form } from 'components/common';
import schema from './../../schema';
import FlowInput from './FlowInput';
import useWizardContext from '../../useWizardContext';

const { NAME, DESCRIPTION, FLOW_INPUT } = schema.INITIAL;

const Initial = ({ style }) => {
  const { form } = useWizardContext();
  const { getFieldDecorator } = form;
  return (
    <div style={style}>
      <Form.Item label={NAME.label} required={NAME.required}>
        {getFieldDecorator(NAME.field, {
          rules: [{ required: true, message: NAME.message }],
        })(<Input placeholder={NAME.placeholder} />)}
      </Form.Item>
      <Form.Item label={DESCRIPTION.label}>
        {getFieldDecorator(DESCRIPTION.field)(
          <Input placeholder={DESCRIPTION.placeholder} />
        )}
      </Form.Item>
      <Form.Item label={FLOW_INPUT.label}>
        {getFieldDecorator(FLOW_INPUT.field)(<FlowInput />)}
      </Form.Item>
    </div>
  );
};

Initial.propTypes = {
  // eslint-disable-next-line
  style: PropTypes.object.isRequired,
};

export default Initial;
