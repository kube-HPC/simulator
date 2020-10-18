import React from 'react';
import Drawer from 'components/Drawer';
import useToggle from 'hooks/useToggle';
import { DRAWER_SIZE } from 'const';
import useActivePipeline from './useActivePipeline';
import usePath from './usePath';
import PipelineInfo from './PipelineInfo.react';

const OverviewDrawer = () => {
  const { goTo } = usePath();
  const { pipeline: record } = useActivePipeline();
  const { setOff, isOn } = useToggle(true);

  if (!record) return null;

  return (
    <Drawer
      isOpened={isOn}
      onDidClose={goTo.root}
      onClose={setOff}
      width={DRAWER_SIZE.PIPELINE_INFO}
      title={record.name}>
      <PipelineInfo record={record} />
    </Drawer>
  );
};

export default OverviewDrawer;
