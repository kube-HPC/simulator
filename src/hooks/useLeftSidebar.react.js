import React, { useState, useEffect, useReducer } from 'react';

import { LOCAL_STORAGE_KEYS, LEFT_SIDEBAR_NAMES } from 'const';
import { getBooleanLSItem, setLSItem } from 'utils';
import {
  JobsTable,
  PipelinesTable,
  AlgorithmsTable,
  DriversTable,
  DebugTable,
  WorkersTable,
} from 'components/Tables';
import { createStore } from 'reusable';

const tableSelector = {
  [LEFT_SIDEBAR_NAMES.JOBS]: <JobsTable />,
  [LEFT_SIDEBAR_NAMES.PIPELINES]: <PipelinesTable />,
  [LEFT_SIDEBAR_NAMES.ALGORITHMS]: <AlgorithmsTable />,
  [LEFT_SIDEBAR_NAMES.WORKERS]: <WorkersTable />,
  [LEFT_SIDEBAR_NAMES.DRIVERS]: <DriversTable />,
  [LEFT_SIDEBAR_NAMES.DEBUG]: <DebugTable />,
};

const leftCollapsedInitial =
  getBooleanLSItem(LOCAL_STORAGE_KEYS.LEFT_SIDEBAR_IS_VISIBLE) ||
  getBooleanLSItem(LOCAL_STORAGE_KEYS.USER_GUIDE_STATUS);

const useLeftSidebar = () => {
  const [value, setValue] = useState(LEFT_SIDEBAR_NAMES.JOBS);
  const [isCollapsed, toggle] = useReducer(p => !p, leftCollapsedInitial);

  useEffect(() => {
    setLSItem(LOCAL_STORAGE_KEYS.LEFT_SIDEBAR_IS_VISIBLE, isCollapsed);
  }, [isCollapsed]);

  return {
    value: [value, setValue],
    isCollapsed: [isCollapsed, toggle],
    selector: tableSelector,
  };
};

export default createStore(useLeftSidebar);
