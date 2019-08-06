import React from 'react';
import usePipeline from 'hooks/usePipeline.react';

import DynamicTable from 'components/Layout/DynamicTable.react';
import pipelinesTableColumns from 'components/tables/Pipelines/PipelinesTableColumns.react';
import PipelineTabSwitcher from 'components/common/TabSwitcher.react';
import CardRow from 'components/common/CardRow.react';

const PipelinesTable = () => {
  const props = usePipeline();
  const { storedPipelines, getPipelineReadme, updatePipelineReadme } = props;
  return (
    <DynamicTable
      rowKey={pipeline => pipeline.name}
      dataSource={storedPipelines}
      columns={pipelinesTableColumns(props)}
      onExpand={(expanded, record) => expanded && updatePipelineReadme(record)}
      expandedRowRender={record => (
        <CardRow>
          <PipelineTabSwitcher
            jsonObject={record}
            readme={getPipelineReadme(record)}
          />
        </CardRow>
      )}
    />
  );
};

export default PipelinesTable;
