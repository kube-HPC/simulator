import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Input, AutoComplete as AntAutoComplete } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import isEqual from 'lodash/isEqual';
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
      dropdownMatchSelectWidth={true}>
      <Input.Search allowClear />
    </AutoCompleteLong>
  );
}

AutoComplete.propTypes = {
  table: PropTypes.string.isRequired,
  ...AntAutoComplete.propTypes,
};

const areEqualByTableName = (prevProps, nextProps) => prevProps.table === nextProps.table;
export default React.memo(AutoComplete, areEqualByTableName);
