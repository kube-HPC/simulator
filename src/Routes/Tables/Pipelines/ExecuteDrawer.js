import React, { useMemo } from 'react';
import Drawer from 'components/Drawer';
import { TabDrawerText, TabDrawer } from 'styles';
import useToggle from 'hooks/useToggle';
import MissingIdError from 'components/MissingIdError';
import { DRAWER_SIZE, DRAWER_TITLES } from 'const';
import { useExperiments } from 'hooks/graphql';
import { schema as experimentsSchema } from 'hooks/graphql/useExperiments';
import AddPipeline from '../../SidebarRight/AddPipeline';
import useActivePipeline from './useActivePipeline';
import usePath from './usePath';

const ExecuteDrawer = () => {
  const { goTo, pipelineId } = usePath();
  const { pipeline: record, loading } = useActivePipeline();
  const { setOff, isOn } = useToggle(true);
  const { ...executePipeline } = record || {};

  const { experimentId: experimentName } = useExperiments();
  const value = useMemo(
    () =>
      JSON.stringify(
        {
          ...executePipeline,
          ...(experimentName === experimentsSchema.SHOW_ALL
            ? {}
            : { experimentName }),
        },
        null,
        4
      ),
    [executePipeline, experimentName]
  );

  if (loading) return 'Loading...';
  return (
    <Drawer
      getContainer={false}
      isOpened={isOn}
      onDidClose={goTo.root}
      onClose={setOff}
      width={DRAWER_SIZE.PIPELINE_INFO}
      title={record?.name ?? pipelineId}
      asFlex>
      {record ? (
        <AddPipeline isRunPipeline getContainer={false} jsonPipeline={value} />
      ) : (
        <MissingIdError />
      )}
      <TabDrawer>
        <TabDrawerText>{DRAWER_TITLES.PIPELINE_EXECUTE}</TabDrawerText>
      </TabDrawer>
    </Drawer>
  );
};

export default React.memo(ExecuteDrawer);
