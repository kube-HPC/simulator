import React from 'react';
import PropTypes from 'prop-types';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Form, Button, Row, Col } from 'antd';
import InputField from './InputField';

const listAddOn = ['', '@', '#', '#@'];

const Controller = ({ nodeIdx }) => (
  <Form.List name={['nodes', nodeIdx, 'input']}>
    {(fields, { add, remove }) => (
      <>
        {fields.map(({ key, name, fieldKey, ...restField }) => (
          <Row key={key} justify="space-between" align="middle">
            <Col span={22}>
              <Form.Item
                style={{ marginBottom: 10 }}
                {...restField}
                name={[name]}
                fieldKey={[fieldKey]}
                rules={[
                  {
                    required: true,
                    message:
                      "Please input algorithm's name or delete this field.",
                  },
                ]}>
                <InputField addonBefore={listAddOn} />
              </Form.Item>
            </Col>
            <Col>
              <MinusCircleOutlined onClick={() => remove(name)} />
            </Col>
          </Row>
        ))}
        <Form.Item>
          <Button
            type="dashed"
            onClick={() => add()}
            block
            icon={<PlusOutlined />}>
            Add field
          </Button>
        </Form.Item>
      </>
    )}
  </Form.List>
);

Controller.propTypes = {
  nodeIdx: PropTypes.node.isRequired,
};

export default Controller;
