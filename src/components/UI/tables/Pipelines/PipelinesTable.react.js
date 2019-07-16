import { useSelector, useDispatch } from 'react-redux';
import React from 'react';

import { getPipelineReadme } from 'actions/readme.action';
import usePipeline from 'hooks/usePipeline.react';

import DynamicTable from 'components/UI/Layout/DynamicTable.react';
import pipelinesTableColumns from 'components/UI/tables/Pipelines/PipelinesTableColumns.react';
import PipelineTabSwitcher from 'components/common/TabSwitcher.react';
import CardRow from 'components/common/CardRow.react';
import { createSelector } from 'reselect';

const tableDataSelector = createSelector(
  state => state.pipelineTable.dataSource.asMutable(),
  state => state.autoCompleteFilter.filter,
  (dataSource, filter) =>
    dataSource && dataSource.filter(row => row.name.includes(filter))
);

function PipelinesTable() {
  const storedPipelines = useSelector(tableDataSelector);
  const readmeDefault = useSelector(state => state.pipelineReadme);
  const dataStats = useSelector(state => state.pipelineTable.dataStats);
  const dispatch = useDispatch();

  return (
    <DynamicTable
      rowKey={pipeline => pipeline.name}
      dataSource={storedPipelines || []}
      columns={pipelinesTableColumns({
        ...usePipeline(),
        dataStats: dataStats || [],
        readmeDefault
      })}
      onExpand={(expanded, record) => {
        if (expanded) dispatch(getPipelineReadme(record.name));
      }}
      expandedRowRender={record => (
        <CardRow>
          <PipelineTabSwitcher
            jsonObject={record}
            readme={
              readmeDefault &&
              readmeDefault[record.name] &&
              readmeDefault[record.name].readme &&
              readmeDefault[record.name].readme.readme
            }
          />
        </CardRow>
      )}
    />
  );
}

export default PipelinesTable;
