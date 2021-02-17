import React, { useCallback, useMemo } from 'react';
import { stringify } from 'utils';
import { DRAWER_SIZE } from 'const';
import Drawer from 'components/Drawer';
import useToggle from 'hooks/useToggle';
import DrawerEditor from 'components/Drawer/DrawerEditor.react';
import MissingIdError from 'components/MissingIdError';
import { useActions } from 'hooks';
import usePath from './usePath';
import useActiveAlgorithm from './useActiveAlgorithm';

const EditDrawer = () => {
  const { goTo } = usePath();
  const { activeAlgorithm, algorithmId } = useActiveAlgorithm();
  const { applyAlgorithm } = useActions();
  const { setOff, isOn } = useToggle(true);
  const onSubmitUpdate = useCallback(
    payload => {
      const formData = new FormData();
      formData.append('payload', payload);
      applyAlgorithm(formData);
    },
    [applyAlgorithm]
  );

  const value = useMemo(() => {
    const { builds, ...rest } = activeAlgorithm || {};
    return stringify(rest);
  }, [activeAlgorithm]);

  return (
    <Drawer
      isOpened={isOn}
      onClose={setOff}
      onDidClose={goTo.root}
      width={DRAWER_SIZE.ALGORITHM_INFO}
      title={activeAlgorithm?.name ?? algorithmId}
      asFlex>
      {activeAlgorithm ? (
        <DrawerEditor
          value={value}
          submitText="submit"
          onSubmit={onSubmitUpdate}
        />
      ) : (
        <MissingIdError />
      )}
    </Drawer>
  );
};

export default React.memo(EditDrawer);
