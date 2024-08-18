import React from 'react';
import { SkeletonLoader } from 'components/common';
import { Route, Routes } from 'react-router-dom';
import { Table } from 'components';
import { usePolling } from 'hooks';
import { useQuery, useReactiveVar } from '@apollo/client';
import { Space } from 'antd';
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

  if (query.loading && query.data?.algorithms?.list?.length === 0)
    return <SkeletonLoader />;
  if (query.error) return `Error! ${query.error.message}`;

  const getList = queryVal => {
    const filterValue = instanceFilter.algorithms.qAlgorithmName;

    if (filterValue != null && queryVal.data?.algorithms?.list) {
      const filterAlgorithm = queryVal.data?.algorithms?.list.filter(item =>
        item.name.includes(filterValue)
      );
      return [...filterAlgorithm];
    }

    return (
      (queryVal.data &&
        queryVal.data.algorithms &&
        queryVal.data.algorithms.list &&
        [...queryVal.data.algorithms.list].sort((x, y) => {
          if (x.unscheduledReason && !y.unscheduledReason) return -1;
          if (!x.unscheduledReason && y.unscheduledReason) return 1;

          return x.modified < y.modified ? 1 : -1;
        })) ||
      []
    );
    //  );
  };

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
          dataSource={getList(query)}
          columns={algorithmColumns}
          onRow={onRow}
          scroll={{
            y: '80vh',
          }}
          locale={{
            emptyText: <SkeletonLoader />,
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
