import React from 'react';
import { Route } from 'react-router-dom';
import { Table } from 'components';
import { useAlgorithm } from 'hooks';
import algorithmColumns from './algorithmColumns';
import usePath from './usePath';
import OverviewDrawer from './OverviewDrawer';
import EditDrawer from './EditDrawer';

const rowKey = ({ name }) => name;

const AlgorithmsTable = () => {
  const { collection } = useAlgorithm();
  const { goTo } = usePath();

  const onRow = ({ name }) => ({
    onDoubleClick: () => goTo.overview({ nextAlgorithmId: name }),
  });

  return (
    <>
      <Table
        onRow={onRow}
        rowKey={rowKey}
        columns={algorithmColumns}
        dataSource={collection}
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
