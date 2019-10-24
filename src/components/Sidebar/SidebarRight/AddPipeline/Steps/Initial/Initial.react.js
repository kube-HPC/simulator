import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

import { Form } from 'components/common';
import schema from 'config/schema/addPipeline.schema';
import FlowInput from './FlowInput.react';
import { FormContext } from '../../AddPipelineForm.react';

const { NAME, DESCRIPTION, FLOW_INPUT } = schema.INITIAL;

const Initial = () => {
  const { getFieldDecorator } = useContext(FormContext);

  return (
    <>
      <Form.Item label={NAME.label} required={NAME.required}>
        {getFieldDecorator(NAME.field)(<Input placeholder={NAME.placeholder} />)}
      </Form.Item>
      <Form.Item label={DESCRIPTION.label}>
        {getFieldDecorator(DESCRIPTION.field)(
          <Input.TextArea placeholder={DESCRIPTION.placeholder} />
        )}
      </Form.Item>
      <Form.Item label={FLOW_INPUT.label}>
        {getFieldDecorator(FLOW_INPUT.field)(<FlowInput />)}
      </Form.Item>
    </>
  );
};

Initial.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired
};

export default Initial;
