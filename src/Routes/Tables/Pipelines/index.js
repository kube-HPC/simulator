import React, { useCallback } from 'react';
import { Route } from 'react-router-dom';
import { Table } from 'components';
import { usePolling } from 'hooks';
import { useQuery } from '@apollo/client';
import { PIPELINE_QUERY } from './../../../qraphql/queries';
import pipelineColumns from './pipelineColumns';
import OverviewDrawer from './OverviewDrawer';
import usePath from './usePath';
import EditDrawer from './EditDrawer';
import ExecuteDrawer from './ExecuteDrawer';

const rowKey = ({ name }) => `pipeline-${name}`;

const PipelinesTable = () => {
  //  const { collection } = usePipeline();
  const { goTo } = usePath();
  const query = useQuery(PIPELINE_QUERY);
  usePolling(query, 3000);

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
        //  dataSource={collection}
        dataSource={query.data?.pipelines}
        columns={pipelineColumns}
        onRow={onRow}
        expandIcon={false}
      />
      <Route
        path="/pipelines/:pipelineId/overview/:tabKey?"
        component={OverviewDrawer}
      />
      <Route path="/pipelines/:pipelineId/edit" component={EditDrawer} />
      <Route path="/pipelines/:pipelineId/execute" component={ExecuteDrawer} />
    </>
  );
};

export default React.memo(PipelinesTable);
