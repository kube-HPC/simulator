import React from 'react';
import Drawer from 'components/Drawer';
import { DRAWER_SIZE } from 'const';
import useToggle from 'hooks/useToggle';
import MissingIdError from 'components/MissingIdError';
import AlgorithmsTabs from './Tabs';
import usePath from './usePath';
import useActiveAlgorithm from './useActiveAlgorithm';

const OverviewDrawer = () => {
  const { goTo } = usePath();
  const { setOff, isOn } = useToggle(true);
  const { activeAlgorithm, algorithmId } = useActiveAlgorithm();

  return (
    <Drawer
      isOpened={isOn}
      onDidClose={goTo.root}
      onClose={setOff}
      width={DRAWER_SIZE.ALGORITHM_INFO}
      title={algorithmId}>
      {activeAlgorithm ? (
        <AlgorithmsTabs algorithm={activeAlgorithm} />
      ) : (
        <MissingIdError />
      )}
    </Drawer>
  );
};

export default React.memo(OverviewDrawer);
