import React from 'react';

import { usePipeline } from 'hooks';
import { Table } from 'components';

import { Card, TabSwitcherMD } from 'components/common';
import getPipelineColumns from './getPipelineColumns.react';

const PipelinesTable = () => {
  const pipelineProps = usePipeline();
  const { dataSource, getPipelineReadme, updatePipelineReadme } = pipelineProps;

  return (
    <Table
      rowKey={({ name }) => name}
      dataSource={dataSource}
      columns={getPipelineColumns(pipelineProps)}
      onExpand={(expanded, record) => expanded && updatePipelineReadme(record)}
      expandedRowRender={record => (
        <Card isMargin>
          <TabSwitcherMD jsonObject={record} readme={getPipelineReadme(record)} />
        </Card>
      )}
    />
  );
};

export default React.memo(PipelinesTable);
