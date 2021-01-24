import { AutoComplete as AntAutoComplete, Input } from 'antd';
import { useActions } from 'hooks';
import PropTypes from 'prop-types';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { selectors } from 'reducers';

const AutoCompleteLong = styled(AntAutoComplete)`
  width: 100%;
`;

const selectorsMap = {
  jobs: selectors.jobs.ids,
  algorithms: selectors.algorithms.collection.ids,
  pipelines: selectors.pipelines.collection.names,
  drivers: selectors.drivers.ids,
  workers: selectors.workers.ids,
  debug: selectors.debug.ids,
  datasources: selectors.dataSources.names,
};

const AutoComplete = ({ className }) => {
  const { pageName } = useParams();

  const tableData = useSelector(selectorsMap[pageName]);

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
