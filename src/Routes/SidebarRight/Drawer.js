import React, { useCallback } from 'react';
import Drawer from 'components/Drawer';
import { RIGHT_SIDEBAR_NAMES } from 'const';
import useToggle from 'hooks/useToggle';
import { useHistory, useParams } from 'react-router-dom';
import AddAlgorithm from './AddAlgorithm';
import AddDebug from './AddDebug';
import AddPipeline from './AddPipeline';
import AddDataSource from './AddDataSource';
import ErrorLogsTable from './ErrorLogs';
import RunRawPipeline from './RunRawPipeline';
import MemoryAndStorage from './MemoryAndStorage';
import NodeStatistics from './NodeStatistics.react';
import CONTENT_CONFIG from './Content.react';
import ctx from './ctx';

const operationSelector = {
  [RIGHT_SIDEBAR_NAMES.ADD_PIPELINE]: <AddPipeline />,
  [RIGHT_SIDEBAR_NAMES.ADD_ALGORITHM]: <AddAlgorithm />,
  [RIGHT_SIDEBAR_NAMES.ADD_DEBUG]: <AddDebug />,
  [RIGHT_SIDEBAR_NAMES.RUN_RAW_PIPELINE]: <RunRawPipeline />,
  [RIGHT_SIDEBAR_NAMES.ADD_DATASOURCE]: <AddDataSource />,
  [RIGHT_SIDEBAR_NAMES.ERROR_LOGS]: <ErrorLogsTable />,
  [RIGHT_SIDEBAR_NAMES.MEMORY]: <MemoryAndStorage />,
  [RIGHT_SIDEBAR_NAMES.CPU]: <NodeStatistics metric="cpu" />,
  [RIGHT_SIDEBAR_NAMES.GPU]: <NodeStatistics metric="gpu" />,
};

const DashboardDrawer = () => {
  const { panelType, root } = useParams();
  const { isOn, setOff } = useToggle(true);
  const history = useHistory();

  const handleDidClose = useCallback(() => {
    history.push(`/${root}${window.location.search}`);
  }, [root, history]);

  const body = operationSelector[panelType];
  const width = CONTENT_CONFIG[panelType]?.width ?? 0;
  return (
    <ctx.Provider value={{ closeDrawer: setOff }}>
      <Drawer
        width={width}
        isOpened={isOn}
        onDidClose={handleDidClose}
        onClose={setOff}
        style={{
          display: 'flex',
          flexDirection: 'column',
          overFlow: 'hidden',
        }}
        asFlex
        destroyOnClose>
        {body}
      </Drawer>
    </ctx.Provider>
  );
};

export default DashboardDrawer;
