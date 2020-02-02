import { Table } from 'components';
import { DRAWER_SIZE } from 'const';
import { useActions, usePipeline } from 'hooks';
import React from 'react';
import getPipelineColumns from './getPipelineColumns.react';
import PipelineTabs from './PipelineTabs.react';

const rowKey = ({ name }) => name;

const PipelinesTable = () => {
  const { dataSource, ...actions } = usePipeline();

  const { drawerOpen } = useActions();

  const onRow = record => ({
    onDoubleClick: () => {
      const { name } = record;
      const body = <PipelineTabs record={record} />;
      drawerOpen({ title: name, body, width: DRAWER_SIZE.ALGORITHM_INFO });
    },
  });

  return (
    <Table
      rowKey={rowKey}
      dataSource={dataSource}
      columns={getPipelineColumns(actions)}
      onRow={onRow}
      expandIcon={false}
    />
  );
};

export default React.memo(PipelinesTable);
