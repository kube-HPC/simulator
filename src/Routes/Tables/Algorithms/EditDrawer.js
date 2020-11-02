import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { stringify } from 'utils';
import { DRAWER_SIZE } from 'const';
import Drawer from 'components/Drawer';
import useToggle from 'hooks/useToggle';
import DrawerEditor from 'components/Drawer/DrawerEditor.react';
import { useActions } from 'hooks';
import usePath from './usePath';
import useActivePipeline from './useActiveAlgorithm';

const EditDrawer = () => {
  const { goTo } = usePath();
  const { activeAlgorithm } = useActivePipeline();
  const { applyAlgorithm } = useActions();
  const { setOff, isOn } = useToggle(true);

  const onSubmitUpdate = useCallback(
    payload =>
      applyAlgorithm({
        ...JSON.parse(payload),
        builds: activeAlgorithm.builds,
      }),
    [applyAlgorithm, activeAlgorithm]
  );

  const value = useMemo(() => {
    const { builds, ...rest } = activeAlgorithm;
    return stringify(rest);
  }, [activeAlgorithm]);

  return (
    <Drawer
      isOpened={isOn}
      onClose={setOff}
      onDidClose={goTo.root}
      width={DRAWER_SIZE.ALGORITHM_INFO}>
      <DrawerEditor
        value={value}
        submitText="submit"
        onSubmit={onSubmitUpdate}
      />
    </Drawer>
  );
};

EditDrawer.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  pipeline: PropTypes.any.isRequired,
};

export default EditDrawer;
