import React, { useMemo, useCallback } from 'react';
import Drawer from 'components/Drawer';
import DrawerEditor from 'components/Drawer/DrawerEditor.react';
import useToggle from 'hooks/useToggle';
import { DRAWER_SIZE } from 'const';
import { useActions } from 'hooks';
import { experimentsSchema } from 'config';
import useActivePipeline from './useActivePipeline';
import usePath from './usePath';

const ExecuteDrawer = () => {
  const { goTo } = usePath();
  const { pipeline: record } = useActivePipeline();
  const { setOff, isOn } = useToggle(true);
  const { nodes, description, triggers, experimentName, ...executePipeline } =
    record || {}; // a fallback in case of an invalid/missing id,
  //                 useActivePipeline redirects automatically back to the root
  const { execStored } = useActions();

  const value = useMemo(() => JSON.stringify(executePipeline, null, 4), [
    executePipeline,
  ]);

  const onSubmit = useCallback(
    () =>
      execStored(
        experimentName === experimentsSchema.showAll
          ? executePipeline
          : { experimentName, ...executePipeline }
      ),
    [experimentName, executePipeline, execStored]
  );

  if (!record) return null;

  return (
    <Drawer
      isOpened={isOn}
      onDidClose={goTo.root}
      onClose={setOff}
      width={DRAWER_SIZE.PIPELINE_INFO}
      title={record.name}>
      <DrawerEditor value={value} submitText="submit" onSubmit={onSubmit} />
    </Drawer>
  );
};

export default ExecuteDrawer;
