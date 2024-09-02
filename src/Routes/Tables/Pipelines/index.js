import React, { useCallback, useEffect } from 'react';
import { SkeletonLoader } from 'components/common';
import { Route, Routes } from 'react-router-dom';
import { Table } from 'components';
import { usePolling } from 'hooks';
import { useQuery, useReactiveVar } from '@apollo/client';
import { PIPELINE_QUERY } from 'graphql/queries';

import { pipelineListVar, instanceFiltersVar } from 'cache';
import { Space, Empty } from 'antd';

import pipelineColumns from './pipelineColumns';
import OverviewDrawer from './OverviewDrawer';
import usePath from './usePath';
import EditDrawer from './EditDrawer';
import ExecuteDrawer from './ExecuteDrawer';
import PipelinesQueryTable from './PipelinesQueryTable';

const rowKey = ({ name }) => `pipeline-${name}`;

const PipelinesTable = () => {
  const { goTo } = usePath();
  const onRow = useCallback(
    record => ({
      onDoubleClick: () => goTo.overview({ nextPipelineId: record.name }),
    }),
    [goTo]
  );

  const pipelineList = useReactiveVar(pipelineListVar);
  const instanceFilter = useReactiveVar(instanceFiltersVar);

  const query = useQuery(PIPELINE_QUERY);
  usePolling(query, 3000);

  const onSubmitFilter = useCallback(
    values => {
      if (!query.loading) {
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
    [query.data?.pipelines?.pipelinesCount]
  );

  useEffect(() => {
    onSubmitFilter(instanceFilter.pipelines);
  }, [query.data?.pipelines?.pipelinesCount]);

  if (query.loading && pipelineList.length === 0) return <SkeletonLoader />;
  if (query.error) return `Error! ${query.error.message}`;

  return (
    <>
      <Space
        direction="vertical"
        size="middle"
        style={{
          display: 'flex',
        }}>
        <PipelinesQueryTable
          pipelinesList={pipelineList}
          onSubmit={onSubmitFilter}
        />

        <Table
          rowKey={rowKey}
          dataSource={pipelineList}
          columns={pipelineColumns}
          onRow={onRow}
          scroll={{
            y: '80vh',
          }}
          locale={{
            emptyText: (
              <Empty
                description={<span>No results match your search criteria</span>}
              />
            ),
          }}
        />
      </Space>
      <Routes>
        <Route
          path=":pipelineId/overview/:tabKey?"
          element={<OverviewDrawer />}
        />
        <Route path=":pipelineId/edit" element={<EditDrawer />} />
        <Route path=":pipelineId/execute" element={<ExecuteDrawer />} />
      </Routes>
    </>
  );
};

export default React.memo(PipelinesTable);
