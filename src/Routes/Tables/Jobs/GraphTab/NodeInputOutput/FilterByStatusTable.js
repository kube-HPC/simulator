import React, { useMemo, useState } from 'react';
import { Button, Checkbox } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import BaseTag from 'components/BaseTag';
import { COLOR_TASK_STATUS } from 'styles/colors';
import PropTypes from 'prop-types';
import { taskStatuses as TASK_STATUS } from '@hkube/consts';

const FilterByStatusTable = ({ OnFilter, DefaultValue, StatusCount }) => {
  const optionsWithCustomStyle = useMemo(
    () =>
      Object.values(TASK_STATUS).map(status => ({
        label: status,
        value: status,
      })),
    []
  );

  const [checkedValues, setCheckedValues] = useState(DefaultValue);

  const onChange = newCheckedValues => {
    setCheckedValues(newCheckedValues);
    OnFilter(newCheckedValues);
  };

  let numberfilterShow = 0;
  return (
    <>
      <FilterOutlined style={{ padding: '10px', fontSize: 18 }} />
      {optionsWithCustomStyle.map(option => {
        StatusCount[option.value] && numberfilterShow++;
        return (
          StatusCount[option.value] && (
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
                {StatusCount[option.value]}{' '}
                {numberfilterShow <= 4 ? option.label : ''}
              </BaseTag>
            </Checkbox>
          )
        );
      })}
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
  StatusCount: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default FilterByStatusTable;
