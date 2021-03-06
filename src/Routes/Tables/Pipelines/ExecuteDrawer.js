import React, { useMemo, useCallback } from 'react';
import Drawer from 'components/Drawer';
import DrawerEditor from 'components/Drawer/DrawerEditor.react';
import useToggle from 'hooks/useToggle';
import MissingIdError from 'components/MissingIdError';
import { DRAWER_SIZE } from 'const';
import { useActions } from 'hooks';
import { schema as experimentsSchema } from 'hooks/useExperiments';
import useActivePipeline from './useActivePipeline';
import usePath from './usePath';

const ExecuteDrawer = () => {
  const { goTo, pipelineId } = usePath();
  const { pipeline: record } = useActivePipeline();
  const { setOff, isOn } = useToggle(true);
  const { nodes, description, triggers, experimentName, ...executePipeline } =
    record || {};
  const { execStored } = useActions();

  const value = useMemo(() => JSON.stringify(executePipeline, null, 4), [
    executePipeline,
  ]);

  const onSubmit = useCallback(
    nextValue => {
      const parsedValue = JSON.parse(nextValue);
      execStored(
        experimentName === experimentsSchema.showAll
          ? parsedValue
          : { experimentName, ...parsedValue }
      );
    },
    [experimentName, execStored]
  );

  return (
    <Drawer
      isOpened={isOn}
      onDidClose={goTo.root}
      onClose={setOff}
      width={DRAWER_SIZE.PIPELINE_INFO}
      title={record?.name ?? pipelineId}
      asFlex>
      {record ? (
        <DrawerEditor value={value} submitText="Run" onSubmit={onSubmit} />
      ) : (
        <MissingIdError />
      )}
    </Drawer>
  );
};

export default React.memo(ExecuteDrawer);
