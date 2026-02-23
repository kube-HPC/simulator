import React, { useCallback, useEffect, useMemo } from 'react';
import { selectors } from 'reducers';
import { useSelector } from 'react-redux';
import { SkeletonLoader, HKGrid } from 'components/common';
import { Route, Routes } from 'react-router-dom';
import { usePolling } from 'hooks';
import { useQuery, useReactiveVar } from '@apollo/client';
import { PIPELINE_QUERY } from 'graphql/queries';
import { pipelineListVar, instanceFiltersVar } from 'cache';
import { events } from 'utils';
import { Empty } from 'antd';
import styled from 'styled-components';

import pipelineColumns from './pipelineColumns';

import OverviewDrawer from './OverviewDrawer';
import EditDrawer from './EditDrawer';
import ExecuteDrawer from './ExecuteDrawer';
import PipelinesQueryTable from './PipelinesQueryTable';
import usePath from './usePath';

const GridWrapper = styled.div`
  height: calc(100vh - 155px);
  min-height: 500px;
`;

const PipelinesTable = () => {
  const { keycloakEnable } = useSelector(selectors.connection);
  const { goTo } = usePath();

  const pipelineList = useReactiveVar(pipelineListVar);
  const instanceFilter = useReactiveVar(instanceFiltersVar);

  const query = useQuery(PIPELINE_QUERY);
  usePolling(query, 3000);

  const onSubmitFilter = useCallback(
    (values, pipelines) => {
      const pipelinesList = pipelines || query.data?.pipelines?.list;

      if (!query.loading && pipelinesList) {
        if (values?.qPipelineName) {
          const searchTerm = values.qPipelineName.toLowerCase().trim();
          pipelineListVar(
            pipelinesList.filter(item =>
              item.name.toLowerCase().includes(searchTerm)
            )
          );
        } else {
          pipelineListVar(pipelinesList);
        }
      }
    },
    [query.loading, query.data?.pipelines?.list]
  );

  const refreshPipelinesData = useCallback(async () => {
    const { data } = await query.refetch();
    onSubmitFilter(instanceFilter.pipelines, data?.pipelines?.list);
  }, [instanceFilter.pipelines, onSubmitFilter, query]);

  useEffect(() => {
    onSubmitFilter(instanceFilter.pipelines);
  }, [instanceFilter.pipelines, onSubmitFilter, query.data?.pipelines?.list]);

  useEffect(() => {
    events.on('update_pipeline_list', refreshPipelinesData);
    return () => {
      events.off('update_pipeline_list', refreshPipelinesData);
    };
  }, [refreshPipelinesData]);

  const columnDefs = useMemo(() => {
    if (!keycloakEnable) {
      return pipelineColumns.slice(1);
    }
    return pipelineColumns;
  }, [keycloakEnable]);

  const onRowDoubleClicked = useCallback(
    params => {
      goTo.overview({ nextPipelineId: params.data.name });
    },
    [goTo]
  );

  if (query.loading && pipelineList.length === 0) {
    return <SkeletonLoader />;
  }

  if (query.error) {
    return `Error! ${query.error.message}`;
  }

  return (
    <>
      <PipelinesQueryTable
        pipelinesList={pipelineList}
        onSubmit={onSubmitFilter}
      />

      <GridWrapper>
        {pipelineList.length === 0 ? (
          <Empty description="No results match your search criteria" />
        ) : (
          <HKGrid
            rowData={pipelineList}
            columnDefs={columnDefs}
            getRowId={params => `pipeline-${params.data.name}`}
            onRowDoubleClicked={onRowDoubleClicked}
          />
        )}
      </GridWrapper>

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
