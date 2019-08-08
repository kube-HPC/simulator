import React, { useCallback } from 'react';
import { Input, AutoComplete } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { autoCompleteFilter } from 'actions/layout.action';
import styled from 'styled-components';
import { LEFT_SIDEBAR_NAMES } from 'constants/sidebar-names';
import { STATE_SOURCES } from 'reducers/root.reducer';

const AutoCompleteTransparent = styled(AutoComplete)`
  background: transparent;
  width: 600px;
`;

const tableSelector = {
  [LEFT_SIDEBAR_NAMES.JOBS]: STATE_SOURCES.JOBS_TABLE,
  [LEFT_SIDEBAR_NAMES.PIPELINES]: STATE_SOURCES.PIPELINE_TABLE,
  [LEFT_SIDEBAR_NAMES.WORKERS]: STATE_SOURCES.WORKER_TABLE,
  [LEFT_SIDEBAR_NAMES.DRIVERS]: STATE_SOURCES.DRIVER_TABLE,
  [LEFT_SIDEBAR_NAMES.ALGORITHMS]: STATE_SOURCES.ALGORITHM_TABLE,
  [LEFT_SIDEBAR_NAMES.DEBUG]: STATE_SOURCES.DEBUG_TABLE,
  [LEFT_SIDEBAR_NAMES.BUILDS]: STATE_SOURCES.ALGORITHM_BUILDS_TABLE
};

const tableSearchBy = {
  [LEFT_SIDEBAR_NAMES.JOBS]: job => job.key,
  [LEFT_SIDEBAR_NAMES.PIPELINES]: pipeline => pipeline.name,
  [LEFT_SIDEBAR_NAMES.WORKERS]: algorithm => algorithm.algorithmName,
  [LEFT_SIDEBAR_NAMES.DRIVERS]: driver => driver.driverId,
  [LEFT_SIDEBAR_NAMES.ALGORITHMS]: algorithm => algorithm.name,
  [LEFT_SIDEBAR_NAMES.DEBUG]: algorithm => algorithm.name,
  [LEFT_SIDEBAR_NAMES.BUILDS]: build => build.buildId
};

const getDataByTable = table => state =>
  tableSelector[table] &&
  state[tableSelector[table]].dataSource.map(tableSearchBy[table]);

function TableAutoComplete({ table, ...props }) {
  const selector = useCallback(getDataByTable(table), [table]);

  const tableData = useSelector(selector);

  const dispatch = useDispatch();
  const filterData = useCallback(e => dispatch(autoCompleteFilter(e)), [
    dispatch
  ]);

  return (
    <AutoCompleteTransparent
      {...props}
      dataSource={tableData}
      onSearch={filterData}
      onSelect={filterData}
      placeholder="Search in current table"
      dropdownMatchSelectWidth={true}
    >
      <Input.Search allowClear />
    </AutoCompleteTransparent>
  );
}

const areEqual = (prevProps, nextProps) => prevProps.table === nextProps.table;

export default React.memo(TableAutoComplete, areEqual);
AutoCompleteTransparent.whyDidYouRender = true;
TableAutoComplete.whyDidYouRender = true;
