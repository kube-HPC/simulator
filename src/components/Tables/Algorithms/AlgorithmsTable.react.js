import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getAlgorithmReadme } from 'actions/readme.action';
import { Table } from 'components';

import { useAlgorithm } from 'hooks';
import { LEFT_SIDEBAR_NAMES } from 'const';

import getAlgorithmColumns from './getAlgorithmColumns.react';
import { tableFilterSelector } from 'utils/tableSelector';
import AlgorithmsTabs from './AlgorithmsTabs.react';
import getReadmeSource from './utils';

const dataSelector = tableFilterSelector(LEFT_SIDEBAR_NAMES.ALGORITHMS);

const AlgorithmsTable = () => {
  const dataSource = useSelector(dataSelector);
  const readmeDict = useSelector(state => state.algorithmReadme);
  const dispatch = useDispatch();

  const onExpand = (isExpanded, record) => isExpanded && dispatch(getAlgorithmReadme(record.name));
  const expandedRowRender = record => (
    <AlgorithmsTabs record={record} source={getReadmeSource({ name: record.name, readmeDict })} />
  );

  return (
    <Table
      rowKey={record => record.name}
      columns={getAlgorithmColumns({ ...useAlgorithm(), readmeDict })}
      dataSource={dataSource}
      onExpand={onExpand}
      expandedRowRender={expandedRowRender}
    />
  );
};

export default AlgorithmsTable;
