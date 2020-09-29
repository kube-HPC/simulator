import React, { useCallback } from 'react';
import Drawer from 'components/Drawer/Drawer.react';
import { Route, useHistory, useParams } from 'react-router-dom';
import { Table } from 'components';
import { DRAWER_SIZE } from 'const';
import { useAlgorithm } from 'hooks';
import getAlgorithmColumns from './getAlgorithmColumns.react';
import { AlgorithmsTabs } from './Tabs';

const rowKey = ({ name }) => name;

const AlgorithmsDrawer = () => {
  const { algorithmId } = useParams();
  const history = useHistory();

  const goBack = useCallback(() => {
    history.replace('/algorithms');
  }, [history]);
  return (
    <Drawer startOpen onClose={goBack} width={DRAWER_SIZE} title={algorithmId}>
      <AlgorithmsTabs name={algorithmId} />
    </Drawer>
  );
};

const AlgorithmsTable = () => {
  const { dataSource, ...actions } = useAlgorithm();

  const history = useHistory();

  const onRow = ({ name }) => ({
    onDoubleClick: () => history.push(`/algorithms/${name}`),
  });

  return (
    <>
      <Table
        onRow={onRow}
        rowKey={rowKey}
        columns={getAlgorithmColumns(actions)}
        dataSource={dataSource}
        expandIcon={false}
      />
      <Route
        exact
        path="/algorithms/:algorithmId"
        component={AlgorithmsDrawer}
      />
    </>
  );
};

export default AlgorithmsTable;
