import { AutoComplete as AntAutoComplete, Input } from 'antd';
import { useActions } from 'hooks';
import PropTypes from 'prop-types';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import getDataByTable from './getDataByTable';

const AutoCompleteLong = styled(AntAutoComplete)`
  width: 100%;
`;

const AutoComplete = ({ className }) => {
  const { pageName } = useParams();

  const tableData = useSelector(getDataByTable(pageName));

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
AutoComplete.defaultProps = {
  className: '',
};

const areEqualByTableName = (prevProps, nextProps) =>
  prevProps.table === nextProps.table;

export default React.memo(AutoComplete, areEqualByTableName);
