import React, { useCallback } from 'react';
import { Route } from 'react-router-dom';
import { Table } from 'components';
import { usePolling } from 'hooks';
import { useQuery, useReactiveVar } from '@apollo/client';
import { Space } from 'antd';
import { algorithmsListVar } from 'cache';
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
  const query = useQuery(ALGORITHMS_QUERY);
  usePolling(query, 3000);

  const onSubmitFilter = useCallback(
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

  if (query.loading && algorithmsList.length === 0) return 'Loading...';
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
          algorithmsList={algorithmsList}
          onSubmit={onSubmitFilter}
        />

        <TableAlgorithms
          rowKey={rowKey}
          dataSource={algorithmsList}
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
