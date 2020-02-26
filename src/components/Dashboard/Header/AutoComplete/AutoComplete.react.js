import { AutoComplete as AntAutoComplete, Input } from 'antd';
import { useActions } from 'hooks';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import getDataByTable from './getDataByTable';

const AutoComplete = ({ table, ...props }) => {
  const tableData = useSelector(getDataByTable(table), isEqual);

  const { filterData } = useActions();

  return (
    <AntAutoComplete
      {...props}
      dataSource={tableData}
      onSearch={filterData}
      onSelect={filterData}
      placeholder="Filter Entities 🎉"
      dropdownMatchSelectWidth>
      <Input.Search allowClear />
    </AntAutoComplete>
  );
};

AutoComplete.propTypes = {
  table: PropTypes.string.isRequired,
};

const areEqualByTableName = (prevProps, nextProps) => prevProps.table === nextProps.table;

export default React.memo(AutoComplete, areEqualByTableName);
