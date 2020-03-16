import { Table } from 'components';
import { useAlgorithm } from 'hooks';
import React from 'react';
import getAlgorithmColumns from './getAlgorithmColumns.react';

const rowKey = ({ name }) => name;

const AlgorithmsTable = () => {
  const { dataSource } = useAlgorithm();

  return (
    <Table
      rowKey={rowKey}
      columns={getAlgorithmColumns()}
      dataSource={dataSource}
      expandIcon={false}
    />
  );
};

export default AlgorithmsTable;
