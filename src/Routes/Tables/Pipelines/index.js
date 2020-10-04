import React, { useCallback } from 'react';
import { Route } from 'react-router-dom';
import { Table } from 'components';
import { usePipeline } from 'hooks';
import pipelineColumns from './pipelineColumns';
import OverviewDrawer from './OverviewDrawer';
import usePath from './usePath';
import EditDrawer from './EditDrawer';

const rowKey = ({ name }) => name;

const PipelinesTable = () => {
  const { dataSource } = usePipeline();
  const { goTo } = usePath();

  const onRow = useCallback(
    record => ({
      onDoubleClick: () => goTo.overview({ nextPipelineId: record.name }),
    }),
    [goTo]
  );

  return (
    <>
      <Table
        rowKey={rowKey}
        dataSource={dataSource}
        columns={pipelineColumns}
        onRow={onRow}
        expandIcon={false}
      />
      <Route
        path="/pipelines/:pipelineId/overview/:tabKey?"
        component={OverviewDrawer}
      />
      <Route path="/pipelines/:pipelineId/edit" component={EditDrawer} />
    </>
  );
};

export default PipelinesTable;
