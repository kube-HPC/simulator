import React, { useCallback } from 'react';
import Drawer from 'components/Drawer/Drawer.react';
import { Route, useHistory, useParams } from 'react-router-dom';
import { Table } from 'components';
import { DRAWER_SIZE } from 'const';
import { useAlgorithm } from 'hooks';
import useToggle from 'hooks/useToggle';
import getAlgorithmColumns from './getAlgorithmColumns.react';
import { AlgorithmsTabs } from './Tabs';

const rowKey = ({ name }) => name;

const AlgorithmsDrawer = () => {
  const { algorithmId } = useParams();
  const history = useHistory();
  const { setOff, isOn } = useToggle(true);
  const goBack = useCallback(() => {
    history.replace('/algorithms');
  }, [history]);
  return (
    <Drawer
      isOpened={isOn}
      onDidClose={goBack}
      onClose={setOff}
      width={DRAWER_SIZE}
      title={algorithmId}>
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
