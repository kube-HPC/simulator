import { Table } from 'components';
import { usePipeline } from 'hooks';
import React from 'react';
import getPipelineColumns from './getPipelineColumns.react';

const rowKey = ({ name }) => name;

const PipelinesTable = () => {
  const { dataSource } = usePipeline();

  return (
    <Table
      rowKey={rowKey}
      dataSource={dataSource}
      columns={getPipelineColumns()}
      expandIcon={false}
    />
  );
};

export default React.memo(PipelinesTable);
