import React, { useMemo } from 'react';
import { TabDrawerText, TabDrawer } from 'styles';

import { stringify } from 'utils';
import { DRAWER_SIZE } from 'const';
import Drawer from 'components/Drawer';
import useToggle from 'hooks/useToggle';
import MissingIdError from 'components/MissingIdError';

import IDProvider from 'IDProvider';
import AddAlgorithm from '../../SidebarRight/AddAlgorithm';
import usePath from './usePath';
import useActiveAlgorithm from './useActiveAlgorithm';
import { DRAWER_TITLES } from '../../../const';

const EditDrawer = () => {
  const { goTo } = usePath();
  const { activeAlgorithm, algorithmId } = useActiveAlgorithm();
  const { setOff, isOn } = useToggle(true);

  const algorithmValue = useMemo(() => {
    const { builds, ...rest } = activeAlgorithm || {};
    return stringify(rest);
  }, [activeAlgorithm]);

  return (
    <IDProvider dataTestId="popup-drawer">
      <Drawer
        isOpened={isOn}
        onClose={setOff}
        onDidClose={goTo.root}
        width={DRAWER_SIZE.ADD_ALGORITHM}
        title={activeAlgorithm?.name ?? algorithmId}
        asFlex>
        <>
          <TabDrawer>
            <TabDrawerText>{DRAWER_TITLES.ALGORITHM_EDIT}</TabDrawerText>
          </TabDrawer>
          {activeAlgorithm ? (
            <AddAlgorithm algorithmValue={algorithmValue} />
          ) : (
            <MissingIdError />
          )}
        </>
      </Drawer>
    </IDProvider>
  );
};

export default React.memo(EditDrawer);
