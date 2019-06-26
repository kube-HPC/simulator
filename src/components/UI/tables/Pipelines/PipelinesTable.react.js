import { useSelector, useDispatch } from 'react-redux';
import React, { useCallback } from 'react';
import { getPipelineReadme, postPipelineReadme } from 'actions/readme.action';
import DynamicTable from 'components/UI/Layout/DynamicTable.react';
import pipelinesTableColumns from 'components/UI/tables/Pipelines/PipelinesTableColumns.react';
import PipelineTabSwitcher from 'components/UI/tables/Pipelines/PipelinesTabSwitcher.react';
import CardRow from 'components/common/CardRow.react';

function PipelinesTable() {
  const storedPipelines = useSelector(state => state.pipelineTable.dataSource);
  const pipelineReadme = useSelector(state => state.pipelineReadme);
  const dataStats = useSelector(state => state.pipelineTable.dataStats);

  const dispatch = useDispatch();

  const onSubmitReadme = useCallback(
    (name, readme) => dispatch(postPipelineReadme(name, readme)),
    [dispatch]
  );

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
            onSubmit={onSubmitReadme}
            readme={
              pipelineReadme &&
              pipelineReadme[record.name] &&
              pipelineReadme[record.name].readme &&
              pipelineReadme[record.name].readme.readme
            }
          />
        </CardRow>
      )}
    />
  );
}

export default PipelinesTable;
