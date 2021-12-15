import React from 'react';
import { pipelineTypes } from '@hkube/consts';
import { useQOrderJobFilters } from 'hooks';
import { toUpperCaseFirstLetter } from 'utils';
import { Select as AntSelect, Typography } from 'antd';
import styled from 'styled-components';
import { FlexBox } from 'components/common';
import priorityType from 'const/priority';

const { Option } = AntSelect;
const types = Object.values(pipelineTypes);
const priorities = Object.values(priorityType);

const Select = styled(AntSelect)`
  width: 250px;
`;

const WarperFilters = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
  margin-left: 5px;
`;

// component QOrderJobsTable
const QOrderJobsTable = () => {
  const { filters, setFilters } = useQOrderJobFilters('qTypesFilter');
  const {
    filters: priorityFilters,
    setFilters: setPriorityFilters,
  } = useQOrderJobFilters('qPriorityFilter');

  return (
    <WarperFilters>
      <FlexBox.Auto justify="flex-start">
        <Typography.Text strong>Group By :</Typography.Text>

        <Select
          value={filters}
          onChange={setFilters}
          mode="multiple"
          allowClear
          placeholder="Pipeline Types">
          {types.map(type => (
            <Option key={type}>{toUpperCaseFirstLetter(type)}</Option>
          ))}
        </Select>
        <Select
          value={priorityFilters}
          onChange={setPriorityFilters}
          mode="multiple"
          allowClear
          placeholder="Priority">
          {priorities.map(item => (
            <Option key={item}>{toUpperCaseFirstLetter(item)}</Option>
          ))}
        </Select>
      </FlexBox.Auto>
    </WarperFilters>
  );
};

export default React.memo(QOrderJobsTable);
