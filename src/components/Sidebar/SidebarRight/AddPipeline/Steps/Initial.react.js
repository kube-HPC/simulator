import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'components/common';
import { Input } from 'antd';
import addPipelineSchema from 'config/schema/addPipeline.schema';

const { NAME, DESCRIPTION } = addPipelineSchema.INITIAL;

const Initial = ({ getFieldDecorator }) => (
  <>
    <Form.Item label={NAME.label} required={NAME.required}>
      {getFieldDecorator(NAME.field)(<Input placeholder={NAME.placeholder} />)}
    </Form.Item>
    <Form.Item label={DESCRIPTION.label}>
      {getFieldDecorator(DESCRIPTION.field)(
        <Input.TextArea placeholder={DESCRIPTION.placeholder} />
      )}
    </Form.Item>
    {/* <Form.Item label={FLOW_INPUT.label}>
      <Card>
        <JsonEditor />
      </Card>
    </Form.Item> */}
  </>
);

Initial.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired
};

export default Initial;
