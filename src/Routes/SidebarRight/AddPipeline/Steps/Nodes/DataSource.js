import React from 'react';
import PropTypes from 'prop-types';
import { Input, Form } from 'antd';
import useWizardContext from '../../useWizardContext';

const DataSourceNode = ({ id }) => {
  const {
    form: { getFieldDecorator },
  } = useWizardContext();
  return (
    <Form.Item label="Input">
      {getFieldDecorator(`nodes.${id}.dataSourceName`, {
        validateTrigger: ['onChange', 'onBlur'],
        rules: [
          {
            required: true,
            whitespace: true,
            message: "Please input dataSource's name or delete this field.",
          },
        ],
      })(<Input placeholder="dataSourceName" />)}
    </Form.Item>
  );
};
DataSourceNode.propTypes = {
  id: PropTypes.node.isRequired,
};
export default DataSourceNode;
