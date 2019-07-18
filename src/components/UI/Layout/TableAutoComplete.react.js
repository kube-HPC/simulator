import React from 'react';
import { Icon, Input, AutoComplete } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { autoCompleteFilter } from 'actions/layout.action';
import styled from 'styled-components';

const InputTransparent = styled(AutoComplete)`
  background: transparent;
  width: 600px;
`;

const tableSelector = {
  Jobs: 'jobsTable',
  Pipelines: 'pipelineTable',
  Workers: 'workerTable',
  Drivers: 'driverTable',
  Algorithms: 'algorithmTable',
  Debug: 'debugTable',
  Builds: 'algorithmBuildsTable'
};
const tableSearchBy = {
  Jobs: job => job.key,
  Pipelines: pipeline => pipeline.name,
  Workers: algorithm => algorithm.algorithmName,
  Drivers: driver => driver.driverId,
  Algorithms: algorithm => algorithm.name,
  Debug: algorithm => algorithm.name,
  Builds: build => build.buildId
};

const getDataByTable = table => state =>
  tableSelector[table] &&
  state[tableSelector[table]].dataSource.map(tableSearchBy[table]);

// TODO: Change all tables name to const, ie: TABLE.CPU
// TODO: write custom hook for tableSelector due to code duplication
const disabledTable = ['CPU', 'Memory'];

function TableAutoComplete({ table }) {
  const isDisabled = disabledTable.includes(table);

  const tableData = useSelector(getDataByTable(table));
  const dispatch = useDispatch();
  const filterData = e => dispatch(autoCompleteFilter(e));

  return (
    <InputTransparent
      disabled={isDisabled}
      dataSource={tableData}
      onSearch={filterData}
      onSelect={filterData}
      placeholder="Search in current table"
      dropdownMatchSelectWidth={true}
    >
      <Input suffix={<Icon type="search" />} />
    </InputTransparent>
  );
}

export default TableAutoComplete;
