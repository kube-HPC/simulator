import React from 'react';
import { TabDrawerText, TabDrawer } from 'styles';
import Drawer from 'components/Drawer';
import { DRAWER_SIZE } from 'const';
import useToggle from 'hooks/useToggle';
import MissingIdError from 'components/MissingIdError';
import AlgorithmsTabs from './Tabs';
import usePath from './usePath';
import useActiveAlgorithm from './useActiveAlgorithm';
import { DRAWER_TITLES } from '../../../const';

const OverviewDrawer = () => {
  const { goTo } = usePath();
  const { setOff, isOn } = useToggle(true);
  const { activeAlgorithm, algorithmId } = useActiveAlgorithm();

  return (
    <Drawer
      getContainer={false}
      isOpened={isOn}
      onDidClose={goTo.root}
      onClose={setOff}
      width={DRAWER_SIZE.ALGORITHM_INFO}
      title={algorithmId}>
      <>
        <TabDrawer>
          <TabDrawerText>{DRAWER_TITLES.ALGORITHM_INFO}</TabDrawerText>
        </TabDrawer>
        {activeAlgorithm ? (
          <AlgorithmsTabs algorithm={activeAlgorithm} />
        ) : (
          <MissingIdError />
        )}
      </>
    </Drawer>
  );
};

export default React.memo(OverviewDrawer);
