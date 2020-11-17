import React, { useMemo } from 'react';
import { DRAWER_SIZE } from 'const';
import Drawer from 'components/Drawer';
import useDataSources from 'hooks/useDataSources';
import useToggle from 'hooks/useToggle';
import usePath from './usePath';

const EditDrawer = () => {
  const { goTo, dataSourceId } = usePath();
  const { dataSources } = useDataSources();
  const activeAlgorithm = useMemo(
    () => dataSources.find(item => item.id === dataSourceId),
    [dataSources, dataSourceId]
  );
  // const { activeAlgorithm } = useActivePipeline();
  // const { applyAlgorithm } = useActions();
  const { setOff, isOn } = useToggle(true);

  return (
    <Drawer
      isOpened={isOn}
      onClose={setOff}
      onDidClose={goTo.root}
      width={DRAWER_SIZE.ADD_DATASOURCE}>
      <h1>{activeAlgorithm.name}</h1>
    </Drawer>
  );
};

EditDrawer.propTypes = {};

export default EditDrawer;
