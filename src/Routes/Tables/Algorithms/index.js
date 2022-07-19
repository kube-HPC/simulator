import React, { useCallback, useState } from 'react';
import { Route } from 'react-router-dom';
import { Table } from 'components';
import { usePolling } from 'hooks';
import { useQuery, useReactiveVar } from '@apollo/client';
import { Collapse } from 'react-collapse';
import { filterToggeledVar } from 'cache';
import { ALGORITHMS_QUERY } from 'graphql/queries';
import OverviewDrawer from './OverviewDrawer';
import usePath from './usePath';
import EditDrawer from './EditDrawer';
import algorithmColumns from './columns';
import AlgorithmsQueryTable from './AlgorithmsQueryTable';

const rowKey = ({ name }) => `algorithm-${name}`;

const AlgorithmsTable = () => {
  const filterToggeled = useReactiveVar(filterToggeledVar);
  const [algorithmFilterList, setAlgorithmFilterList] = useState([]);
  const { goTo } = usePath();

  const query = useQuery(ALGORITHMS_QUERY);
  usePolling(query, 10000);

  const onRow = ({ name }) => ({
    onDoubleClick: () => goTo.overview({ nextAlgorithmId: name }),
  });

  const onSubmitFilter = useCallback(values => {
    if (values?.qAlgorithmName) {
      const filterAlgorithm = query.data?.algorithms?.list.filter(item =>
        item.name.includes(values.qAlgorithmName)
      );

      setAlgorithmFilterList(filterAlgorithm);
    } else {
      setAlgorithmFilterList(query.data?.algorithms?.list);
    }
  });

  return (
    <>
      <Collapse isOpened={filterToggeled}>
        <AlgorithmsQueryTable
          algorithmsList={query.data?.algorithms?.list}
          onSubmit={onSubmitFilter}
        />
      </Collapse>

      <Table
        rowKey={rowKey}
        //  dataSource={collection}
        dataSource={algorithmFilterList}
        columns={algorithmColumns}
        onRow={onRow}
        expandIcon={false}
        scroll={{
          y: '80vh',
        }}
      />
      <Route
        exact
        path="/algorithms/:algorithmId/overview/:tabKey"
        component={OverviewDrawer}
      />
      <Route path="/algorithms/:algorithmId/edit" component={EditDrawer} />
    </>
  );
};

export default AlgorithmsTable;
