import React from 'react';
import Drawer from 'components/Drawer';
import { DRAWER_SIZE } from 'const';
import useToggle from 'hooks/useToggle';
import AlgorithmsTabs from './Tabs';
import usePath from './usePath';

export default () => {
  const { goTo, algorithmId } = usePath();
  const { setOff, isOn } = useToggle(true);
  return (
    <Drawer
      isOpened={isOn}
      onDidClose={goTo.root}
      onClose={setOff}
      width={DRAWER_SIZE.ALGORITHM_INFO}
      title={algorithmId}>
      <AlgorithmsTabs name={algorithmId} />
    </Drawer>
  );
};
