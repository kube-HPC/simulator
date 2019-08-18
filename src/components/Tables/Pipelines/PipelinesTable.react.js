import React from 'react';

import { usePipeline } from 'hooks';
import { Table } from 'components';

import { CardRow, TabSwitcherMD } from 'components/common';
import getPipelineColumns from './getPipelineColumns.react';

const PipelinesTable = () => {
  const props = usePipeline();
  const { storedPipelines, getPipelineReadme, updatePipelineReadme } = props;

  return (
    <Table
      rowKey={({ name }) => name}
      dataSource={storedPipelines}
      columns={getPipelineColumns(props)}
      onExpand={(expanded, record) => expanded && updatePipelineReadme(record)}
      expandedRowRender={record => (
        <CardRow>
          <TabSwitcherMD jsonObject={record} readme={getPipelineReadme(record)} />
        </CardRow>
      )}
    />
  );
};

export default PipelinesTable;
