import React, { forwardRef } from 'react';
import { TypeFilter } from 'const';
import { toUpperCaseFirstLetter } from 'utils';
import PropTypes from 'prop-types';
import { SelectGroupBy } from '../OrderStyles';

const SelectFilterOptions = forwardRef((props, ref) => (
  // eslint-disable-next-line
  <SelectGroupBy
    ref={ref}
    onChange={e => props.onSelect(e)}
    options={Object.entries(TypeFilter).map(([key, value]) => ({
      value: key,
      label: toUpperCaseFirstLetter(value),
    }))}
    defaultValue={
      props.filterVal !== '' ? props.filterVal : TypeFilter.PIPELINE
    }
  />
));

SelectFilterOptions.propTypes = {
  onSelect: PropTypes.func.isRequired,
  filterVal: PropTypes.string.isRequired,
};

export default SelectFilterOptions;
