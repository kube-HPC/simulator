import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { selectors } from 'reducers';
import { useSelector } from 'react-redux';
import { SkeletonLoader } from 'components/common';
import { Route, Routes } from 'react-router-dom';
import { Table } from 'components';
import { usePolling } from 'hooks';
import { useQuery, useReactiveVar } from '@apollo/client';
import { PIPELINE_QUERY } from 'graphql/queries';

import { pipelineListVar, instanceFiltersVar } from 'cache';
import { Empty } from 'antd';
import styled from 'styled-components';
import pipelineColumns from './pipelineColumns';
import OverviewDrawer from './OverviewDrawer';
import usePath from './usePath';
import EditDrawer from './EditDrawer';
import ExecuteDrawer from './ExecuteDrawer';
import PipelinesQueryTable from './PipelinesQueryTable';

const NUMBER_ROW_VIRTUAL = 150;
const TablePipelines = styled(Table)`
  .ant-table-body {
    min-height: 75vh;
  }
  .fixed-row-height .ant-table-cell {
    height: 58px;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    padding: 0 16px;
    box-sizing: border-box;
    white-space: nowrap;
  }
`;

const rowKey = ({ name }) => `pipeline-${name}`;

const PipelinesTable = () => {
  const { keycloakEnable } = useSelector(selectors.connection);

  const { goTo } = usePath();
  const onRow = useCallback(
    (record, isVirtual) => ({
      onDoubleClick: () => goTo.overview({ nextPipelineId: record.name }),
      className: isVirtual ? 'fixed-row-height' : '',
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
          const filterPipeline = query.data.pipelines.list.filter(item =>
            item.name.includes(values.qPipelineName)
          );
          pipelineListVar(filterPipeline);
        } else {
          pipelineListVar(query.data.pipelines.list);
        }
      }
    },
    [query.data?.pipelines?.pipelinesCount]
  );

  useEffect(() => {
    onSubmitFilter(instanceFilter.pipelines);
  }, [query.data?.pipelines?.pipelinesCount]);

  const [tableHeight, setTableHeight] = useState(() =>
    typeof window !== 'undefined'
      ? Math.max(window.innerHeight - 200, 400)
      : 400
  );

  useEffect(() => {
    const calculate = () => {
      const offset = 200;
      const height = Math.max(window.innerHeight - offset, 400);
      setTableHeight(height);
    };
    calculate();
    window.addEventListener('resize', calculate);
    return () => window.removeEventListener('resize', calculate);
  }, []);

  // if have keycloak remove avatar from columns job
  const pipelinesColumnsView = useMemo(() => {
    if (!keycloakEnable) {
      return pipelineColumns.slice(1);
    }
    return pipelineColumns;
  }, [keycloakEnable]);

  if (query.loading && pipelineList.length === 0) return <SkeletonLoader />;
  if (query.error) return `Error! ${query.error.message}`;

  return (
    <>
      <PipelinesQueryTable
        pipelinesList={pipelineList}
        onSubmit={onSubmitFilter}
      />

      <TablePipelines
        virtual={pipelineList.length > NUMBER_ROW_VIRTUAL}
        rowKey={rowKey}
        dataSource={pipelineList}
        columns={pipelinesColumnsView}
        onRow={record =>
          onRow({
            ...record,
            isVirtual: pipelineList.length > NUMBER_ROW_VIRTUAL,
          })
        }
        scroll={{
          y: tableHeight,
        }}
        locale={{
          emptyText: (
            <Empty
              description={<span>No results match your search criteria</span>}
            />
          ),
        }}
      />

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
