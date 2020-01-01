import React from 'react';
import { Select as AntSelect } from 'antd';
import styled from 'styled-components';

const { Option } = AntSelect;

const Select = styled(AntSelect)`
  width: 400px;
`;

const TypeSelect = () => (
  <Select mode="multiple" placeholder="Pick Pipeline Types">
    <Option value="Raw">Raw</Option>
    <Option value="Cached">Cached</Option>
  </Select>
);

export default TypeSelect;
