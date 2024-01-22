import React, { useState } from 'react';
import { Button, Checkbox } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import BaseTag from 'components/BaseTag';
import { COLOR_TASK_STATUS } from 'styles/colors';
import PropTypes from 'prop-types';
import { pipelineStatuses as PIPELINE_STATUS } from '@hkube/consts';

const optionsWithCustomStyle = [
  {
    label: PIPELINE_STATUS.ACTIVE,
    value: PIPELINE_STATUS.ACTIVE,
  },
  {
    label: PIPELINE_STATUS.FAILED,
    value: PIPELINE_STATUS.FAILED,
  },
  {
    label: PIPELINE_STATUS.STOPPED,
    value: PIPELINE_STATUS.STOPPED,
  },
  {
    label: PIPELINE_STATUS.COMPLETED,
    value: PIPELINE_STATUS.COMPLETED,
  },
];

const FilterByStatusTable = ({ OnFilter, DefaultValue }) => {
  const [checkedValues, setCheckedValues] = useState(DefaultValue);

  const onChange = newCheckedValues => {
    setCheckedValues(newCheckedValues);
    OnFilter(newCheckedValues);
  };

  return (
    <>
      <FilterOutlined style={{ padding: '10px', fontSize: 18 }} />
      {optionsWithCustomStyle.map(option => (
        <Checkbox
          key={option.value}
          onChange={() => {
            const currentIndex = checkedValues.indexOf(option.value);
            const newChecked = [...checkedValues];

            if (currentIndex === -1) {
              newChecked.push(option.value);
            } else {
              newChecked.splice(currentIndex, 1);
            }

            onChange(newChecked);
          }}
          checked={checkedValues.includes(option.value)}>
          <BaseTag
            isActiveLoader={false}
            status={option.label}
            colorMap={COLOR_TASK_STATUS}>
            {option.label}
          </BaseTag>
        </Checkbox>
      ))}
      <Button
        onClick={() => onChange([])}
        disabled={checkedValues.length === 0}>
        Clear All
      </Button>
    </>
  );
};

FilterByStatusTable.propTypes = {
  OnFilter: PropTypes.func.isRequired,
  DefaultValue: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

export default FilterByStatusTable;
