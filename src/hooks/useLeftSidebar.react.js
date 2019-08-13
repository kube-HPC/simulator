import React, { useState, useEffect } from 'react';

import { LOCAL_STORAGE_KEYS, LEFT_SIDEBAR_NAMES } from 'const';
import { getBooleanLSItem, setLSItem } from 'utils';
import {
  JobsTable,
  PipelinesTable,
  AlgorithmsTable,
  DriversTable,
  DebugTable,
  AlgorithmBuildsTable,
  WorkersTable
} from 'components/Tables';

const tableSelector = {
  [LEFT_SIDEBAR_NAMES.JOBS]: <JobsTable />,
  [LEFT_SIDEBAR_NAMES.PIPELINES]: <PipelinesTable />,
  [LEFT_SIDEBAR_NAMES.ALGORITHMS]: <AlgorithmsTable />,
  [LEFT_SIDEBAR_NAMES.WORKERS]: <WorkersTable />,
  [LEFT_SIDEBAR_NAMES.DRIVERS]: <DriversTable />,
  [LEFT_SIDEBAR_NAMES.DEBUG]: <DebugTable />,
  [LEFT_SIDEBAR_NAMES.BUILDS]: <AlgorithmBuildsTable />
};

const leftCollapsedInitial =
  getBooleanLSItem(LOCAL_STORAGE_KEYS.LEFT_SIDEBAR_IS_VISIBLE) ||
  getBooleanLSItem(LOCAL_STORAGE_KEYS.USER_GUIDE_STATUS);

const useLeftSidebar = () => {
  const [value, setValue] = useState(LEFT_SIDEBAR_NAMES.JOBS);
  const [isCollapsed, setIsCollapsed] = useState(leftCollapsedInitial);

  useEffect(() => {
    setLSItem(LOCAL_STORAGE_KEYS.LEFT_SIDEBAR_IS_VISIBLE, isCollapsed);
  }, [isCollapsed]);

  return {
    value: [value, setValue],
    isCollapsed: [isCollapsed, setIsCollapsed],
    selector: tableSelector
  };
};

export default useLeftSidebar;
