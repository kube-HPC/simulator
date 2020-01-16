import { Table } from 'components';
import { usePipeline } from 'hooks';
import React from 'react';
import getPipelineColumns from './getPipelineColumns.react';
import PipelineTabs from './PipelineTabs.react';

const rowKey = ({ name }) => name;

const PipelinesTable = () => {
  const { dataSource, ...actions } = usePipeline();

  const expandedRowRender = record => <PipelineTabs record={record} />;

  return (
    <Table
      rowKey={rowKey}
      dataSource={dataSource}
      columns={getPipelineColumns(actions)}
      expandedRowRender={expandedRowRender}
    />
  );
};

export default React.memo(PipelinesTable);
