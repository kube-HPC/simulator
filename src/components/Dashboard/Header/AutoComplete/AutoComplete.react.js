import { AutoComplete as AntAutoComplete, Input } from 'antd';
import { useActions, useLeftSidebar } from 'hooks';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import getDataByTable from './getDataByTable';

const AutoComplete = ({ className }) => {
  const {
    value: [table],
  } = useLeftSidebar();

  const tableData = useSelector(getDataByTable(table), isEqual);

  const { filterData } = useActions();

  return (
    <AntAutoComplete
      className={className}
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
  className: PropTypes.string,
};

const areEqualByTableName = (prevProps, nextProps) => prevProps.table === nextProps.table;

export default React.memo(AutoComplete, areEqualByTableName);
