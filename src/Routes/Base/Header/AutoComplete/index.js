import { AutoComplete as AntAutoComplete, Input } from 'antd';
import { useActions } from 'hooks';
import PropTypes from 'prop-types';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { selectors } from 'reducers';
import { useDebounceCallback } from '@react-hook/debounce';

const AutoCompleteLong = styled(AntAutoComplete)`
  width: 100%;
  /*border: 1px #e3dcdc;*/
`;

const selectorsMap = {
  jobs: selectors.jobs.ids,
  queue: () => [],
  algorithms: selectors.algorithms.collection.ids,
  pipelines: selectors.pipelines.collection.names,
  drivers: selectors.drivers.allDataAutocomplete,
  workers: selectors.workers.ids,
  datasources: selectors.dataSources.names,
};
const disableFilter = ['queue'];

const AutoComplete = ({ className = '' }) => {
  // const { pageName } = useParams();
  const { pathname } = useLocation();
  const pageName = pathname.split('/')[1] || '';
  console.log('pageName2', pageName);
  const isDisabled = disableFilter.includes(pageName);
  const tableData = useSelector(selectorsMap[pageName]).map(x => ({
    value: x,
    label: x,
  }));

  const { filterData } = useActions();
  const handleFilter = useDebounceCallback(filterData, 1000, false);
  return (
    <AutoCompleteLong
      className={className}
      options={tableData}
      onSearch={handleFilter}
      onSelect={handleFilter}
      placeholder="Filter Entities 🎉"
      dropdownMatchSelectWidth
      disabled={isDisabled}>
      <Input.Search allowClear />
    </AutoCompleteLong>
  );
};

AutoComplete.propTypes = {
  className: PropTypes.string,
};

const areEqualByTableName = (prevProps, nextProps) =>
  prevProps.table === nextProps.table;

export default React.memo(AutoComplete, areEqualByTableName);
