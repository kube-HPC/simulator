import React, { useCallback, useMemo } from 'react';
import Drawer from 'components/Drawer';
import { TabDrawerText, TabDrawer } from 'styles';
import { RIGHT_SIDEBAR_NAMES } from 'const';
import useToggle from 'hooks/useToggle';
import { useNavigate, useParams } from 'react-router-dom';
import AddAlgorithm from './AddAlgorithm';
import AddPipeline from './AddPipeline';
import AddDataSource from './AddDataSource';
import ErrorLogsTable from './ErrorLogs';
import RunRawPipeline from './RunRawPipeline';
import MemoryAndStorage from './MemoryAndStorage';
import NodeStatistics from './NodeStatistics.react';
import CpuBarChartMonitors from './CpuBarChartMonitors';
import CONTENT_CONFIG from './Content.react';
import ctx from './ctx';
import useSubscribe from './useSubscribe';
import { DRAWER_TITLES } from '../../const';
import WorkersTable from '../Tables/Workers';
import DriversTable from '../Tables/Drivers';

const operationSelector = {
  // eslint-disable-next-line
  [RIGHT_SIDEBAR_NAMES.WORKERS]: WorkersTable,
  [RIGHT_SIDEBAR_NAMES.DRIVERS]: DriversTable,
  [RIGHT_SIDEBAR_NAMES.ADD_PIPELINE]: AddPipeline,
  [RIGHT_SIDEBAR_NAMES.ADD_ALGORITHM]: AddAlgorithm,
  [RIGHT_SIDEBAR_NAMES.RUN_RAW_PIPELINE]: RunRawPipeline,
  [RIGHT_SIDEBAR_NAMES.ADD_DATASOURCE]: AddDataSource,
  [RIGHT_SIDEBAR_NAMES.ERROR_LOGS]: ErrorLogsTable,
  [RIGHT_SIDEBAR_NAMES.MEMORY]: MemoryAndStorage,
  [RIGHT_SIDEBAR_NAMES.CPU]: () => <CpuBarChartMonitors metric="cpu" />,
  [RIGHT_SIDEBAR_NAMES.GPU]: () => <CpuBarChartMonitors metric="gpu" />,
};

const titleSelector = {
  // eslint-disable-next-line
  [RIGHT_SIDEBAR_NAMES.WORKERS]: DRAWER_TITLES.WORKERS,
  [RIGHT_SIDEBAR_NAMES.DRIVERS]: DRAWER_TITLES.DRIVERS,
  [RIGHT_SIDEBAR_NAMES.ADD_PIPELINE]: DRAWER_TITLES.ADD_PIPELINE,
  [RIGHT_SIDEBAR_NAMES.ADD_ALGORITHM]: DRAWER_TITLES.ADD_ALGORITHM,
  [RIGHT_SIDEBAR_NAMES.RUN_RAW_PIPELINE]: DRAWER_TITLES.RUN_RAW_PIPELINE,
  [RIGHT_SIDEBAR_NAMES.ADD_DATASOURCE]: DRAWER_TITLES.ADD_DATASOURCE,
  [RIGHT_SIDEBAR_NAMES.ERROR_LOGS]: DRAWER_TITLES.ERROR_LOGS,
  [RIGHT_SIDEBAR_NAMES.CPU]: DRAWER_TITLES.CPU,
  [RIGHT_SIDEBAR_NAMES.MEMORY]: DRAWER_TITLES.MEMORY,
  [RIGHT_SIDEBAR_NAMES.GPU]: DRAWER_TITLES.GPU,
};

const DashboardDrawer = () => {
  const { panelType, root } = useParams();

  // eslint-disable-next-line
  const { isOn, setOff: _setOff } = useToggle(true);
  const { publish } = useSubscribe();
  const setOff = useCallback(() => {
    publish();
    _setOff();
  }, [_setOff, publish]);

  const navigate = useNavigate();

  const handleDidClose = useCallback(() => {
    navigate(`/${root}${window.location.search}`);
  }, [root, navigate]);

  const Body = operationSelector[panelType];
  const width = CONTENT_CONFIG[panelType]?.width ?? 0;
  const titleDrawer = titleSelector[panelType];

  const contextValue = useMemo(() => ({ closeDrawer: setOff }), [setOff]);

  if (root === undefined) {
    navigate('/jobs');
  }

  // eslint-disable-next-line consistent-return
  return (
    <ctx.Provider value={contextValue}>
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
        destroyOnHidden>
        <TabDrawer>
          <TabDrawerText>{titleDrawer}</TabDrawerText>
        </TabDrawer>
        <Body />
      </Drawer>
    </ctx.Provider>
  );
};

export default DashboardDrawer;
