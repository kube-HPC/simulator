import React, { useCallback, useState } from 'react';
import { Route } from 'react-router-dom';
import { Table } from 'components';
import { usePolling } from 'hooks';
import { useQuery, useReactiveVar } from '@apollo/client';
import { PIPELINE_QUERY } from 'graphql/queries';
import { Collapse } from 'react-collapse';
import { filterToggeledVar } from 'cache';

import pipelineColumns from './pipelineColumns';
import OverviewDrawer from './OverviewDrawer';
import usePath from './usePath';
import EditDrawer from './EditDrawer';
import ExecuteDrawer from './ExecuteDrawer';
import PipelinesQueryTable from './PipelinesQueryTable';

const rowKey = ({ name }) => `pipeline-${name}`;

const PipelinesTable = () => {
  const filterToggeled = useReactiveVar(filterToggeledVar);
  const [pipelineFilterList, setPipelineFilterList] = useState([]);
  const { goTo } = usePath();

  const query = useQuery(PIPELINE_QUERY);
  usePolling(query, 3000);

  const onRow = useCallback(
    record => ({
      onDoubleClick: () => goTo.overview({ nextPipelineId: record.name }),
    }),
    [goTo]
  );

  const onSubmitFilter = useCallback(values => {
    if (values?.qPipelineName) {
      const filterPipeline = query.data?.pipelines?.list.filter(item =>
        item.name.includes(values.qPipelineName)
      );

      setPipelineFilterList(filterPipeline);
    } else {
      setPipelineFilterList(query.data?.pipelines?.list);
    }
  });

  return (
    <>
      <Collapse isOpened={filterToggeled}>
        <PipelinesQueryTable
          pipelinesList={query.data?.pipelines?.list}
          onSubmit={onSubmitFilter}
        />
      </Collapse>

      <Table
        rowKey={rowKey}
        //  dataSource={collection}
        dataSource={pipelineFilterList}
        columns={pipelineColumns}
        onRow={onRow}
        expandIcon={false}
        scroll={{
          y: '80vh',
        }}
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
