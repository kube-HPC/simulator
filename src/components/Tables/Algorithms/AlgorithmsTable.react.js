import React from 'react';
import { Table } from 'components';
import { useAlgorithm } from 'hooks';

import getAlgorithmColumns from './getAlgorithmColumns.react';
import AlgorithmsTabs from './Tabs/AlgorithmsTabs.react';

const AlgorithmsTable = () => {
  const { dataSource, ...actions } = useAlgorithm();
  const expandedRowRender = record => <AlgorithmsTabs record={record} />;

  return (
    <Table
      rowKey={({ name }) => name}
      columns={getAlgorithmColumns(actions)}
      dataSource={dataSource}
      expandedRowRender={expandedRowRender}
    />
  );
};

export default AlgorithmsTable;
