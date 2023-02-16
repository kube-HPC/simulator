import React, { useCallback, useEffect } from 'react';
import { Route } from 'react-router-dom';
import { Table } from 'components';
import { usePolling } from 'hooks';
import { useQuery, useReactiveVar } from '@apollo/client';
import { Collapse } from 'react-collapse';
import { Space } from 'antd';
import { filterToggeledVar, algorithmsListVar } from 'cache';
import { ALGORITHMS_QUERY } from 'graphql/queries';
import { useVT } from 'virtualizedtableforantd4';
import styled from 'styled-components';
import OverviewDrawer from './OverviewDrawer';
import usePath from './usePath';
import EditDrawer from './EditDrawer';
import algorithmColumns from './columns';
import AlgorithmsQueryTable from './AlgorithmsQueryTable';

const rowKey = ({ name }) => `algorithm-${name}`;
const TableAlgorithms = styled(Table)`
  .ant-table-body {
    min-height: 80vh;
  }
`;
const AlgorithmsTable = () => {
  const [vt] = useVT(() => ({ scroll: { y: 600 } }), []);
  const filterToggeled = useReactiveVar(filterToggeledVar);
  const algorithmsList = useReactiveVar(algorithmsListVar);

  const { goTo } = usePath();

  const query = useQuery(ALGORITHMS_QUERY);
  usePolling(query, 3000);

  const onRow = ({ name }) => ({
    onDoubleClick: () => goTo.overview({ nextAlgorithmId: name }),
  });

  useEffect(() => {
    if (!query.error && !query.loading) {
      algorithmsListVar(query.data?.algorithms?.list);
    }
  }, [query.data?.algorithms?.list, query.error, query.loading]);

  const onSubmitFilter = useCallback(values => {
    if (!query.error && !query.loading) {
      if (values?.qAlgorithmName) {
        const filterAlgorithm = query.data?.algorithms?.list.filter(item =>
          item.name.includes(values.qAlgorithmName)
        );

        algorithmsListVar(filterAlgorithm);
      } else {
        algorithmsListVar(query.data?.algorithms?.list);
      }
    }
  });

  return (
    <>
      <Space
        direction="vertical"
        size="middle"
        style={{
          display: 'flex',
        }}>
        <Collapse isOpened={filterToggeled}>
          <AlgorithmsQueryTable
            algorithmsList={query.data?.algorithms?.list}
            onSubmit={onSubmitFilter}
          />
        </Collapse>

        <TableAlgorithms
          scroll={{ y: 600 }} // It's important for using VT!!! DO NOT FORGET!!!
          components={vt}
          rowKey={rowKey}
          dataSource={algorithmsList}
          columns={algorithmColumns}
          onRow={onRow}
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
