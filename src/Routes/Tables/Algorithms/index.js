import React from 'react';
import { Route } from 'react-router-dom';
import { Table } from 'components';
import { usePolling } from 'hooks';
import { useQuery, useReactiveVar } from '@apollo/client';
import { Space } from 'antd';
import { algorithmsListVar, instanceFiltersVar } from 'cache';
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

  const algorithmsList = useReactiveVar(algorithmsListVar);
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

  if (query.loading && algorithmsList.length === 0) return 'Loading...';
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
      (queryVal.data?.algorithms?.list &&
        [...queryVal.data?.algorithms?.list].sort((x, y) =>
          x.modified < y.modified ? 1 : -1
        )) ||
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
          algorithmsList={algorithmsList}
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
        />
      </Space>
      <Route
        exact
        path="/algorithms/:algorithmId/overview/:tabKey"
        component={OverviewDrawer}
      />
      <Route path="/algorithms/:algorithmId/edit" component={EditDrawer} />
    </>
  );
};

export default React.memo(AlgorithmsTable);
