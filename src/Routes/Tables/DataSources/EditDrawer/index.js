import React from 'react';
import { DRAWER_SIZE } from 'const';
import Drawer from 'components/Drawer';
import useToggle from 'hooks/useToggle';
import usePath from './../usePath';
import useActiveDataSource from './../useActiveDataSource';
import Header from './Header';
import Body from './Body';

const EditDrawer = () => {
  const { goTo, dataSourceId, mode, snapshotName } = usePath();
  const { dataSource, isReady, status } = useActiveDataSource();
  const { setOff, isOn } = useToggle(true);
  return (
    <Drawer
      isOpened={isOn}
      onClose={setOff}
      onDidClose={goTo.root}
      style={{ display: 'flex', flexDirection: 'column' }}
      width={DRAWER_SIZE.EDIT_DATASOURCE}>
      <Header
        status={status}
        dataSourceId={dataSourceId}
        dataSourceName={dataSource?.name}
      />
      {isReady ? (
        <Body goTo={goTo} mode={mode} snapshotName={snapshotName} />
      ) : null}
    </Drawer>
  );
};

export default EditDrawer;
