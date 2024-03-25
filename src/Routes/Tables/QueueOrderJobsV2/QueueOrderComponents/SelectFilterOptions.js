import React, { forwardRef } from 'react';
import { TypeFilter } from 'const';
import { toUpperCaseFirstLetter } from 'utils';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import { SelectGroupBy } from '../OrderStyles';

const SelectFilterOptions = forwardRef((props, ref) => (
  // eslint-disable-next-line
  <SelectGroupBy
    ref={ref}
    onChange={e => props.onSelect(e)}
    defaultValue={props.filterVal !== '' ? props.filterVal : TypeFilter.JOBID}>
    {Object.entries(TypeFilter).map(([key, value]) => (
      <Select.Option key={key} value={key}>
        {toUpperCaseFirstLetter(value)}
      </Select.Option>
    ))}
  </SelectGroupBy>
));

SelectFilterOptions.propTypes = {
  onSelect: PropTypes.func.isRequired,
  filterVal: PropTypes.string.isRequired,
};

export default SelectFilterOptions;
