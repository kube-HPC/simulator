import React from 'react';
import { Drawer, CONTENT_CONFIG } from 'components/Drawer';
import { useDrawer } from 'hooks';
import { RIGHT_SIDEBAR_NAMES } from 'const';

import {
  AddAlgorithm,
  AddDebug,
  AddPipeline,
  ErrorLogsTable,
  RunRawPipeline,
  MemoryAndStorage,
  NodeStatistics,
} from 'components/Sidebar/SidebarRight';

const operationSelector = {
  [RIGHT_SIDEBAR_NAMES.ADD_PIPELINE]: <AddPipeline />,
  [RIGHT_SIDEBAR_NAMES.ADD_ALGORITHM]: <AddAlgorithm />,
  [RIGHT_SIDEBAR_NAMES.ADD_DEBUG]: <AddDebug />,
  [RIGHT_SIDEBAR_NAMES.RUN_RAW_PIPELINE]: <RunRawPipeline />,
  [RIGHT_SIDEBAR_NAMES.ERROR_LOGS]: <ErrorLogsTable />,
  [RIGHT_SIDEBAR_NAMES.MEMORY]: <MemoryAndStorage />,
  [RIGHT_SIDEBAR_NAMES.CPU]: <NodeStatistics metric="cpu" />,
  [RIGHT_SIDEBAR_NAMES.GPU]: <NodeStatistics metric="gpu" />,
};

const DashboardDrawer = () => {
  const { selectedPanel, closeDrawer, isVisible } = useDrawer();
  const body = operationSelector[selectedPanel];
  const width = CONTENT_CONFIG[selectedPanel]?.width ?? 0;
  return (
    <Drawer
      width={width}
      isOpened={isVisible}
      onClose={closeDrawer}
      destroyOnClose>
      {body}
    </Drawer>
  );
};

export default DashboardDrawer;
