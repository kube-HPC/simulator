import React from 'react';
import { Route } from 'react-router-dom';
import { Table } from 'components';
// import { useAlgorithm } from 'hooks';
import { useQuery } from '@apollo/client';
import { ALGORITHMS_QUERY } from 'qraphql/queries';
import algorithmColumns from './columns';
import usePath from './usePath';
import OverviewDrawer from './OverviewDrawer';
import EditDrawer from './EditDrawer';

const rowKey = ({ name }) => name;

const AlgorithmsTable = () => {
  // const { collection } = useAlgorithm();
  const { goTo } = usePath();
  const query = useQuery(ALGORITHMS_QUERY);
  // usePolling(query, 3000);

  const onRow = ({ name }) => ({
    onDoubleClick: () => goTo.overview({ nextAlgorithmId: name }),
  });

  return (
    <>
      <Table
        onRow={onRow}
        rowKey={rowKey}
        columns={algorithmColumns}
        dataSource={query.data?.algorithms}
        expandIcon={false}
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

export default React.memo(AlgorithmsTable);
