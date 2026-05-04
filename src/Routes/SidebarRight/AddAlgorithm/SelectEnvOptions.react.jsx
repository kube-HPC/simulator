import React, { forwardRef } from 'react';
import { Select } from 'antd';
import { toUpperCaseFirstLetter } from 'utils';
import addAlgorithmSchema from './schema';

const SelectEnvOptions = forwardRef((props, ref) => (
  // eslint-disable-next-line
  <Select
    ref={ref}
    {...props}
    options={Object.entries(addAlgorithmSchema.ENV_TYPES).map(
      ([key, value]) => ({
        value: key,
        label: toUpperCaseFirstLetter(value),
      })
    )}
  />
));

SelectEnvOptions.propTypes = Select.propTypes;

export default SelectEnvOptions;
