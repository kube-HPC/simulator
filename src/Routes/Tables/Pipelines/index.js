import React, { useCallback, useEffect } from 'react';
import { Route } from 'react-router-dom';
import { Table } from 'components';
import { usePolling } from 'hooks';
import { useQuery, useReactiveVar } from '@apollo/client';
import { PIPELINE_QUERY } from 'graphql/queries';
import { Collapse } from 'react-collapse';
import { filterToggeledVar, pipelineListVar } from 'cache';
import { Space } from 'antd';

import pipelineColumns from './pipelineColumns';
import OverviewDrawer from './OverviewDrawer';
import usePath from './usePath';
import EditDrawer from './EditDrawer';
import ExecuteDrawer from './ExecuteDrawer';
import PipelinesQueryTable from './PipelinesQueryTable';

const rowKey = ({ name }) => `pipeline-${name}`;

const PipelinesTable = () => {
  const filterToggeled = useReactiveVar(filterToggeledVar);
  const pipelineList = useReactiveVar(pipelineListVar);
  const { goTo } = usePath();

  const query = useQuery(PIPELINE_QUERY);
  usePolling(query, 3000);

  useEffect(() => {
    if (!query.error && !query.loading) {
      pipelineListVar(query.data?.pipelines?.list);
    }
  }, [query.data?.pipelines?.list, query.error, query.loading]);

  const onRow = useCallback(
    record => ({
      onDoubleClick: () => goTo.overview({ nextPipelineId: record.name }),
    }),
    [goTo]
  );

  const onSubmitFilter = useCallback(
    values => {
      if (!query.error && !query.loading) {
        if (values?.qPipelineName) {
          const filterPipeline = query.data?.pipelines?.list.filter(item =>
            item.name.includes(values.qPipelineName)
          );

          pipelineListVar(filterPipeline);
        } else {
          pipelineListVar(query.data?.pipelines?.list);
        }
      }
    },
    [query.data?.pipelines?.list, query.error, query.loading]
  );

  return (
    <>
      <Space
        direction="vertical"
        size="middle"
        style={{
          display: 'flex',
        }}>
        <Collapse isOpened={filterToggeled}>
          <PipelinesQueryTable
            pipelinesList={pipelineList}
            onSubmit={onSubmitFilter}
          />
        </Collapse>

        <Table
          rowKey={rowKey}
          dataSource={pipelineList}
          columns={pipelineColumns}
          onRow={onRow}
          scroll={{
            y: '80vh',
          }}
        />
      </Space>

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
