import React, { forwardRef } from 'react';
import { Select } from 'antd';
import { toUpperCaseFirstLetter } from 'utils';
import addAlgorithmSchema from 'config/schema/addAlgorithm.schema';

const SelectEnvOptions = forwardRef((props, ref) => (
  <Select ref={ref} {...props}>
    {Object.entries(addAlgorithmSchema.ENV_TYPES).map(([key, value]) => (
      <Select.Option key={key} value={key}>
        {toUpperCaseFirstLetter(value)}
      </Select.Option>
    ))}
  </Select>
));

SelectEnvOptions.propTypes = Select.propTypes;

export default SelectEnvOptions;
