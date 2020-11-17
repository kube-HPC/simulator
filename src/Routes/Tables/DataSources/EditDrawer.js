import React from 'react';
import { DRAWER_SIZE } from 'const';
import Drawer from 'components/Drawer';
import useToggle from 'hooks/useToggle';

const EditDrawer = () => {
  // const { goTo } = usePath();
  // const { activeAlgorithm } = useActivePipeline();
  // const { applyAlgorithm } = useActions();
  const { setOff, isOn } = useToggle(true);

  const onDidClose = () => {};

  return (
    <Drawer
      isOpened={isOn}
      onClose={setOff}
      onDidClose={onDidClose}
      width={DRAWER_SIZE.ADD_DATASOURCE}>
      <p>this is where you edit your datasource</p>
    </Drawer>
  );
};

EditDrawer.propTypes = {};

export default EditDrawer;
