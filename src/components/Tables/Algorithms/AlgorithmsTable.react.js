import { Table } from 'components';
import { DRAWER_SIZE } from 'const';
import { useActions, useAlgorithm } from 'hooks';
import React from 'react';
import getAlgorithmColumns from './getAlgorithmColumns.react';
import { AlgorithmsTabs } from './Tabs';

const rowKey = ({ name }) => name;

const AlgorithmsTable = () => {
  const { dataSource, ...actions } = useAlgorithm();

  const { drawerOpen } = useActions();

  const onRow = record => ({
    onDoubleClick: () => {
      const { name } = record;
      const body = <AlgorithmsTabs record={record} />;
      drawerOpen({ title: name, body, width: DRAWER_SIZE.ALGORITHM_INFO });
    },
  });

  return (
    <Table
      onRow={onRow}
      rowKey={rowKey}
      columns={getAlgorithmColumns(actions)}
      dataSource={dataSource}
      expandIcon={false}
    />
  );
};

export default AlgorithmsTable;
