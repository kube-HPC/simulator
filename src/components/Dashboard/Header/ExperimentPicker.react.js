import { Select } from 'antd';
import { useExperiments } from 'hooks';
import React from 'react';

const { Option } = Select;
const selectWidth = { width: 200 };

const ExperimentPicker = () => {
  const { experiments, value, set: onChange } = useExperiments();
  return (
    <Select style={selectWidth} value={value} onChange={onChange}>
      {experiments.map(({ name }) => (
        <Option key={name} value={name}>
          {name}
        </Option>
      ))}
    </Select>
  );
};

export default ExperimentPicker;
