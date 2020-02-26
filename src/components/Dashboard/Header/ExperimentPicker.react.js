import { Select } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';

const { Option } = Select;

const ExperimentPicker = () => {
  useSelector();
  return (
    <Select>
      <Option value="1">Hello</Option>
    </Select>
  );
};

export default ExperimentPicker;
