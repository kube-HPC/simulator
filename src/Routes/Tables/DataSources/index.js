import React from 'react';
import { Table } from 'components';
import useDataSources from 'hooks/useDataSources';
import tableColumns from './tableColumns';

const rowKey = ({ name }) => name;

const DataSourcesTables = () => {
  const { dataSources } = useDataSources();
  console.log({ dataSources });
  return (
    <Table
      rowKey={rowKey}
      columns={tableColumns}
      dataSource={dataSources}
      expandIcon={false}
    />
  );
};

export default DataSourcesTables;
