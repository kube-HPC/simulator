import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'components/common';
import { Select, Switch, Popover, Input } from 'antd';

const Triggers = ({ getFieldDecorator }) => (
  <>
    <Form.Item label="Cron">
      <Popover content={'pattern'} trigger="focus">
        <Input placeholder="Pattern" />
      </Popover>
    </Form.Item>
    <Form.Item label="Cron Enabled">
      <Switch />
    </Form.Item>
    <Form.Item label="Pipelines">
      <Select mode="multiple" placeholder="Pipelines to activate upon result">
        {}
      </Select>
    </Form.Item>
  </>
);

Triggers.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired
};

export default Triggers;
