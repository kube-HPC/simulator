import React, { useEffect, useState } from 'react';
import { Checkbox } from 'antd';
import { CloseCircleTwoTone, FilterOutlined } from '@ant-design/icons';
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

const FilterByStatusTable = ({ OnFilter, isShowOneRow, statusCount }) => {
  const [checkedValues, setCheckedValues] = useState('');

  const onChange = newCheckedValues => {
    setCheckedValues(newCheckedValues);
    OnFilter(newCheckedValues);
  };

  useEffect(() => {
    onChange(
      !isShowOneRow && statusCount.active > 0 ? [PIPELINE_STATUS.ACTIVE] : ''
    );
  }, []);

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

      <CloseCircleTwoTone
        onClick={() => onChange([])}
        style={{ fontSize: 18 }}
      />
    </>
  );
};

FilterByStatusTable.propTypes = {
  OnFilter: PropTypes.func.isRequired,
  isShowOneRow: PropTypes.bool.isRequired,
  statusCount: PropTypes.shape({
    active: PropTypes.number.isRequired,
  }).isRequired,
};

export default FilterByStatusTable;
