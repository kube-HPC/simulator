import React from 'react';
import Drawer from 'components/Drawer';
import { Button } from 'antd';
import { TabDrawerText, TabDrawer } from 'styles';
import useToggle from 'hooks/useToggle';
import { DRAWER_SIZE } from 'const';
import MissingIdError from 'components/MissingIdError';
import useActivePipeline from './useActivePipeline';
import usePath from './usePath';
import PipelineInfo from './PipelineInfo.react';
import { DRAWER_TITLES } from '../../../const';

const OverviewDrawer = () => {
  const { goTo } = usePath();
  const { pipeline: record, pipelineId } = useActivePipeline();
  const { setOff, isOn } = useToggle(true);

  return (
    <Drawer
      isOpened={isOn}
      onDidClose={goTo.root}
      onClose={setOff}
      width={DRAWER_SIZE.PIPELINE_INFO}
      title={record?.name ?? pipelineId}
      extra={
        <Button type="primary" onClick={goTo.edit}>
          Edit
        </Button>
      }>
      <>
        <TabDrawer>
          <TabDrawerText>{DRAWER_TITLES.PIPELINE_INFO}</TabDrawerText>
        </TabDrawer>
        {record ? <PipelineInfo pipeline={record} /> : <MissingIdError />}
      </>
    </Drawer>
  );
};

export default React.memo(OverviewDrawer);
