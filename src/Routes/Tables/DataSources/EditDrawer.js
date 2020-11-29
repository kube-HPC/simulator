import React from 'react';
import { DRAWER_SIZE } from 'const';
import Drawer from 'components/Drawer';
import useToggle from 'hooks/useToggle';
import usePath from './usePath';
import useActiveDataSource from './useActiveDataSource';
import FileBrowser from './FileBrowser';
import dummyFilesList from './filesList.dummy.json';

const EditDrawer = () => {
  const { goTo } = usePath();
  const { dataSource, isReady } = useActiveDataSource();
  const { setOff, isOn } = useToggle(true);

  if (!isReady) return null;

  return (
    <Drawer
      isOpened={isOn}
      onClose={setOff}
      onDidClose={goTo.root}
      width={DRAWER_SIZE.EDIT_DATASOURCE}>
      <h1>{dataSource.name}</h1>
      <div>
        <FileBrowser files={dummyFilesList} />
      </div>
    </Drawer>
  );
};

EditDrawer.propTypes = {};

export default EditDrawer;
