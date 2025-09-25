import React, { useMemo, useEffect } from 'react';
import { selectors } from 'reducers';
import { useSelector } from 'react-redux';
import { SkeletonLoader } from 'components/common';
import { Route, Routes } from 'react-router-dom';
import { Table } from 'components';
import { usePolling } from 'hooks';
import { useQuery, useReactiveVar, makeVar } from '@apollo/client';
import { Space, Empty } from 'antd';
import { instanceFiltersVar } from 'cache';
import { ALGORITHMS_QUERY } from 'graphql/queries';
import styled from 'styled-components';
import OverviewDrawer from './OverviewDrawer';
import usePath from './usePath';
import EditDrawer from './EditDrawer';
import algorithmColumns from './columns';
import AlgorithmsQueryTable from './AlgorithmsQueryTable';

export const algorithmsListVar = makeVar([]);

const rowKey = ({ name }) => `algorithm-${name}`;
const TableAlgorithms = styled(Table)`
  .ant-table-body {
    min-height: 75vh;
  }
`;

const AlgorithmsTable = () => {
  const { goTo } = usePath();
  const onRow = ({ name }) => ({
    onDoubleClick: () => goTo.overview({ nextAlgorithmId: name }),
  });

  const instanceFilter = useReactiveVar(instanceFiltersVar);
  const { keycloakEnable } = useSelector(selectors.connection);

  const query = useQuery(ALGORITHMS_QUERY, {
    fetchPolicy: 'cache-and-network',
  });

  usePolling(query, 3000);

  useEffect(() => {
    if (query.data?.algorithms?.list) {
      algorithmsListVar(query.data.algorithms.list);
    }
  }, [query.data]);

  const algorithmsList = useReactiveVar(algorithmsListVar);

  const getList = useMemo(() => {
    const filterValue = instanceFilter.algorithms.qAlgorithmName;

    if (filterValue != null && algorithmsList) {
      return algorithmsList.filter(item => item.name.includes(filterValue));
    }

    return [...algorithmsList].sort((x, y) => {
      if (x.unscheduledReason && !y.unscheduledReason) return -1;
      if (!x.unscheduledReason && y.unscheduledReason) return 1;
      return x.modified < y.modified ? 1 : -1;
    });
  }, [instanceFilter.algorithms.qAlgorithmName, algorithmsList]);

  const algorithmColumnsView = useMemo(() => {
    if (!keycloakEnable) {
      return algorithmColumns.slice(1);
    }
    return algorithmColumns;
  }, [keycloakEnable]);

  if (!algorithmsList.length) return <SkeletonLoader />;
  if (query.error) return `Error! ${query.error.message}`;

  return (
    <>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <AlgorithmsQueryTable
          algorithmsList={algorithmsList}
          onSubmit={() => {}}
        />

        <TableAlgorithms
          rowKey={rowKey}
          dataSource={getList}
          columns={algorithmColumnsView}
          onRow={onRow}
          scroll={{ y: '80vh' }}
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
          path=":algorithmId/overview/:tabKey"
          element={<OverviewDrawer />}
        />
        <Route path=":algorithmId/edit" element={<EditDrawer />} />
      </Routes>
    </>
  );
};

export default React.memo(AlgorithmsTable);
