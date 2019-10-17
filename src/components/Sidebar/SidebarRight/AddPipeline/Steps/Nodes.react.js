import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Form, Card, InputAddon } from 'components/common';
import { Input, Select, Button } from 'antd';

const ButtonGroupCenter = styled(Button.Group)`
  display: flex;
  justify-content: center;
`;

const inputOptions = ['String', 'Numeric', 'Object', 'Array', 'Boolean', 'null'];

const Nodes = ({ getFieldDecorator }) => {
  const InputSelect = <InputAddon after={inputOptions} />;
  return (
    <>
      <Form.Item required label="Node Name">
        <Input placeholder="Node Name" />
      </Form.Item>
      <Form.Item required label="Algorithm Name">
        <Select placeholder="Select Algorithm Name">{}</Select>
      </Form.Item>
      <Form.Item label="Input">
        {InputSelect}
        <ButtonGroupCenter>
          <Button block icon="plus" type="dashed">
            Add Input
          </Button>
          <Button block icon="minus" type="dashed">
            Remove Last
          </Button>
        </ButtonGroupCenter>
      </Form.Item>
      <br />
      <Card>
        <Form.Item required label="Node Name">
          <Input placeholder="Node Name" />
        </Form.Item>
        <Form.Item required label="Algorithm Name">
          <Select placeholder="Select Algorithm Name">{}</Select>
        </Form.Item>
        <Form.Item label="Input">
          {InputSelect}
          <ButtonGroupCenter>
            <Button block icon="plus" type="dashed">
              Add Input
            </Button>
            <Button block icon="minus" type="dashed">
              Remove Last
            </Button>
          </ButtonGroupCenter>
        </Form.Item>
      </Card>
      <br />
      <Button icon="plus" block type="primary">
        Add Node
      </Button>
    </>
  );
};

Nodes.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired
};

export default Nodes;
