import React from 'react';
import Drawer from 'components/Drawer';
import { DRAWER_SIZE } from 'const';
import { useAlgorithm } from 'hooks';
import useToggle from 'hooks/useToggle';
import MissingIdError from 'components/MissingIdError';
import AlgorithmsTabs from './Tabs';
import usePath from './usePath';

const OverviewDrawer = () => {
  const { goTo, algorithmId } = usePath();
  const { setOff, isOn } = useToggle(true);
  const { algorithm } = useAlgorithm(algorithmId);

  return (
    <Drawer
      isOpened={isOn}
      onDidClose={goTo.root}
      onClose={setOff}
      width={DRAWER_SIZE.ALGORITHM_INFO}
      title={algorithmId}>
      {algorithm ? <AlgorithmsTabs name={algorithmId} /> : <MissingIdError />}
    </Drawer>
  );
};

export default React.memo(OverviewDrawer);
