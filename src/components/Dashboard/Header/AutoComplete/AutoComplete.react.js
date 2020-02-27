import { AutoComplete as AntAutoComplete, Input } from 'antd';
import { useActions, useLeftSidebar } from 'hooks';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import getDataByTable from './getDataByTable';

const AutoCompleteLong = styled(AntAutoComplete)`
  width: 100%;
`;

const AutoComplete = ({ className }) => {
  const {
    value: [table],
  } = useLeftSidebar();

  const tableData = useSelector(getDataByTable(table), isEqual);

  const { filterData } = useActions();

  return (
    <AutoCompleteLong
      className={className}
      dataSource={tableData}
      onSearch={filterData}
      onSelect={filterData}
      placeholder="Filter Entities 🎉"
      dropdownMatchSelectWidth>
      <Input.Search allowClear />
    </AutoCompleteLong>
  );
};

AutoComplete.propTypes = {
  className: PropTypes.string,
};

const areEqualByTableName = (prevProps, nextProps) => prevProps.table === nextProps.table;

export default React.memo(AutoComplete, areEqualByTableName);
