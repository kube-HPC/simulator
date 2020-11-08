import React from 'react';
import { Table } from 'components';
import tableColumns from './tableColumns';

const rowKey = ({ name }) => name;

const DataSourcesTables = () => {
  const dataSource = [];
  return (
    <Table
      rowKey={rowKey}
      columns={tableColumns}
      dataSource={dataSource}
      expandIcon={false}
    />
  );
};

export default DataSourcesTables;
