import React, { useMemo } from 'react';
import { TabDrawerText, TabDrawer } from 'styles';
import { stringify } from 'utils';
import { DRAWER_SIZE, DRAWER_TITLES } from 'const';
import Drawer from 'components/Drawer';
import useToggle from 'hooks/useToggle';

import usePath from './usePath';
import useActivePipeline from './useActivePipeline';
import AddPipeline from '../../SidebarRight/AddPipeline';

const EditDrawer = () => {
  const { goTo } = usePath();
  const { pipeline, pipelineId, loading } = useActivePipeline();

  const { setOff, isOn } = useToggle(true);

  const value = useMemo(() => stringify(pipeline), [pipeline]);
  if (loading) return 'Loading...';
  return (
    <Drawer
      isOpened={isOn}
      onClose={setOff}
      onDidClose={goTo.root}
      styles={{ body: { padding: '10px' } }}
      width={DRAWER_SIZE.PIPELINE_INFO}
      title={pipeline?.name ?? pipelineId}
      asFlex>
      {pipeline ? (
        <AddPipeline jsonPipeline={value} />
      ) : (
        <p>{pipeline?.name ?? pipelineId} has been deleted</p>
      )}
      <TabDrawer style={{ marginLeft: '-10px' }}>
        <TabDrawerText>{DRAWER_TITLES.EDIT_PIPELINE}</TabDrawerText>
      </TabDrawer>
    </Drawer>
  );
};

export default React.memo(EditDrawer);
