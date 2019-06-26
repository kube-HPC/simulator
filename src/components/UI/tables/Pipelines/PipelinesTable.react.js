import { useSelector, useDispatch } from 'react-redux';
import React from 'react';
import { getPipelineReadme } from 'actions/readme.action';
import DynamicTable from 'components/UI/Layout/DynamicTable.react';
import pipelinesTableColumns from 'components/UI/tables/Pipelines/PipelinesTableColumns.react';
import PipelineTabSwitcher from 'components/UI/tables/Pipelines/PipelinesTabSwitcher.react';
import CardRow from 'components/common/CardRow.react';

function PipelinesTable() {
  const storedPipelines = useSelector(state => state.pipelineTable.dataSource);
  const pipelineReadme = useSelector(state => state.pipelineReadme);
  const dataStats = useSelector(state => state.pipelineTable.dataStats);

  const dispatch = useDispatch();

  return (
    <DynamicTable
      rowKey={pipeline => pipeline.name}
      dataSource={storedPipelines || []}
      columns={pipelinesTableColumns({
        dispatch,
        dataStats: dataStats || []
      })}
      onExpand={(expanded, record) => {
        if (expanded) dispatch(getPipelineReadme(record.name));
      }}
      expandedRowRender={record => (
        <CardRow>
          <PipelineTabSwitcher
            pipelineDetails={record}
            readme={
              pipelineReadme &&
              pipelineReadme[record.name] &&
              pipelineReadme[record.name].readme
            }
          />
        </CardRow>
      )}
    />
  );
}

export default PipelinesTable;
