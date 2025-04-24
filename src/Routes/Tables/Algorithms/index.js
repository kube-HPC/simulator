import React, { useMemo } from 'react';
import { selectors } from 'reducers';
import { useSelector } from 'react-redux';
import { SkeletonLoader } from 'components/common';
import { Route, Routes } from 'react-router-dom';
import { Table } from 'components';
import { usePolling } from 'hooks';
import { useQuery, useReactiveVar } from '@apollo/client';
import { Space, Empty } from 'antd';
import { instanceFiltersVar } from 'cache'; // algorithmsListVar
import { ALGORITHMS_QUERY } from 'graphql/queries';
import styled from 'styled-components';
import OverviewDrawer from './OverviewDrawer';
import usePath from './usePath';
import EditDrawer from './EditDrawer';
import algorithmColumns from './columns';
import AlgorithmsQueryTable from './AlgorithmsQueryTable';

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

  // const algorithmsList = useReactiveVar(algorithmsListVar);
  const instanceFilter = useReactiveVar(instanceFiltersVar);
  const { keycloakEnable } = useSelector(selectors.connection);

  const query = useQuery(ALGORITHMS_QUERY);
  usePolling(query, 3000);

  /* const onSubmitFilter = useCallback(
    values => {
      if (!query.loading) {
        if (values?.qAlgorithmName) {
          const filterAlgorithm = query.data?.algorithms?.list.filter(item =>
            item.name.includes(values.qAlgorithmName)
          );
          const list = [...filterAlgorithm];
          algorithmsListVar(list);
        } else {
          const list = [...query.data?.algorithms?.list];

          algorithmsListVar(
            list.sort((x, y) => (x.modified < y.modified ? 1 : -1))
          );
        }
      }
    },
    [query.data?.algorithms?.list]
  );
  */
  const onSubmitFilter = () => {};

  const getList = useMemo(() => {
    const filterValue = instanceFilter.algorithms.qAlgorithmName;

    if (filterValue != null && query.data?.algorithms?.list) {
      const filterAlgorithm = query.data?.algorithms?.list.filter(item =>
        item.name.includes(filterValue)
      );
      return [...filterAlgorithm];
    }

    return (
      (query.data &&
        query.data.algorithms &&
        query.data.algorithms.list &&
        [...query.data.algorithms.list].sort((x, y) => {
          if (x.unscheduledReason && !y.unscheduledReason) return -1;
          if (!x.unscheduledReason && y.unscheduledReason) return 1;

          return x.modified < y.modified ? 1 : -1;
        })) ||
      []
    );
  }, [instanceFilter.algorithms.qAlgorithmName, query.data]);

  // if have keycloak remove avatar from columns job
  const algorithmColumnsView = useMemo(() => {
    if (!keycloakEnable) {
      return algorithmColumns.slice(1);
    }
    return algorithmColumns;
  }, [keycloakEnable]);

  if (query.loading && query.data === undefined) return <SkeletonLoader />;
  if (query.error) return `Error! ${query.error.message}`;

  return (
    <>
      <Space
        direction="vertical"
        size="middle"
        style={{
          display: 'flex',
        }}>
        <AlgorithmsQueryTable
          algorithmsList={query.data?.algorithms?.list}
          onSubmit={onSubmitFilter}
        />

        <TableAlgorithms
          rowKey={rowKey}
          dataSource={getList}
          columns={algorithmColumnsView}
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
          path=":algorithmId/overview/:tabKey"
          element={<OverviewDrawer />}
        />
        <Route path=":algorithmId/edit" element={<EditDrawer />} />
      </Routes>
    </>
  );
};

export default React.memo(AlgorithmsTable);
