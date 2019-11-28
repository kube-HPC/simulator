import React from 'react';
import { Table } from 'components';
import { useAlgorithm } from 'hooks';

import getAlgorithmColumns from './getAlgorithmColumns.react';
import AlgorithmsTabs from './Tabs/AlgorithmsTabs.react';

const AlgorithmsTable = () => {
  const algorithmActions = useAlgorithm();

  const { fetchReadme, dataSource, getReadme } = algorithmActions;

  const onExpand = (isExpanded, { name }) => isExpanded && fetchReadme(name);

  const expandedRowRender = record => <AlgorithmsTabs record={record} getReadme={getReadme} />;

  return (
    <Table
      rowKey={({ name }) => name}
      columns={getAlgorithmColumns(algorithmActions)}
      dataSource={dataSource}
      onExpand={onExpand}
      expandedRowRender={expandedRowRender}
    />
  );
};

export default AlgorithmsTable;
