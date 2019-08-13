import React, { useCallback } from 'react';
import { Input, AutoComplete as AntAutoComplete } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { isEqual } from 'lodash';
import { autoCompleteFilter } from 'actions/autoComplete.action';
import getDataByTable from './getDataByTable';

const AutoCompleteLong = styled(AntAutoComplete)`
  width: 600px;
`;

function AutoComplete({ table, ...props }) {
  const tableData = useSelector(getDataByTable(table), isEqual);
  const dispatch = useDispatch();
  const filterData = useCallback(e => dispatch(autoCompleteFilter(e)), [dispatch]);

  return (
    <AutoCompleteLong
      {...props}
      dataSource={tableData}
      onSearch={filterData}
      onSelect={filterData}
      placeholder="Search in current table 🎉"
      dropdownMatchSelectWidth={true}
    >
      <Input.Search allowClear />
    </AutoCompleteLong>
  );
}

const areEqualByTableName = (prevProps, nextProps) => prevProps.table === nextProps.table;
export default React.memo(AutoComplete, areEqualByTableName);
